import { useRef, useEffect } from "preact/hooks";
import type { EmailMetadata } from "../../types";
import { searchQuery } from "../../data/store";
import { highlightText, highlightIframe } from "../../utils/highlight";

export function ReadingPane({ email }: { email: EmailMetadata }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terms = searchQuery.value.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const resizeIframe = (iframe: HTMLIFrameElement) => {
    try {
      const doc = iframe.contentDocument;
      if (doc?.body) {
        iframe.style.height = doc.body.scrollHeight + "px";
      }
    } catch (_) {}
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) highlightIframe(doc, terms);
      } catch (_) { /* cross-origin safety */ }
      resizeIframe(iframe);
    };

    iframe.addEventListener("load", onLoad);
    // If already loaded (cached), run immediately
    try {
      const doc = iframe.contentDocument;
      if (doc?.body?.childNodes.length) {
        highlightIframe(doc, terms);
        resizeIframe(iframe);
      }
    } catch (_) {}

    return () => iframe.removeEventListener("load", onLoad);
  }, [email.Payload.ID, searchQuery.value]);

  return (
    <div class="email-client-content">
      {/* Email headers - Outlook 2007 style */}
      <div class="reading-header">
        <div class="subject-line">{highlightText(email.Payload.Subject, terms)}</div>
        <div class="header-field-row">
          <span class="field-label">From:</span>
          <span class="field-value">
            <a href={`mailto:${email.Payload.Sender.Address}`} class="from-link">
              {highlightText(`${email.Payload.Sender.Name} [${email.Payload.Sender.Address}]`, terms)}
            </a>
          </span>
        </div>
        <div class="header-field-row">
          <span class="field-label">Sent:</span>
          <span class="field-value">
            {new Date(email.Payload.Time * 1000).toLocaleString()}
          </span>
        </div>
        <div class="header-field-row">
          <span class="field-label">To:</span>
          <span class="field-value">
            {highlightText(
              email.Payload.ToList.map((t) => t.Name || t.Address).join(", ") || "\u2014",
              terms,
            )}
          </span>
        </div>
        {email.Payload.CCList.length > 0 && (
          <div class="header-field-row">
            <span class="field-label">CC:</span>
            <span class="field-value">
              {highlightText(email.Payload.CCList.map((c) => c.Address).join(", "), terms)}
            </span>
          </div>
        )}
      </div>
      {/* Email body iframe */}
      <div class="reading-body">
        <iframe
          ref={iframeRef}
          src={`/emails/${email.Payload.ID}.html`}
          width="100%"
          class="reading-iframe"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
