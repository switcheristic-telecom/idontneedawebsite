import { useRef, useEffect, useCallback } from "preact/hooks";
import type { EmailMetadata } from "../../types";
import { searchQuery } from "../../data/store";
import { highlightText, highlightIframe } from "../../utils/highlight";

export function ReadingPane({ email }: { email: EmailMetadata }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terms = searchQuery.value.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const syncIframeSize = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      // Disable iframe scrolling — the parent container handles it
      doc.documentElement.style.overflow = "hidden";
      doc.body.style.overflow = "hidden";
      iframe.style.height = doc.documentElement.scrollHeight + "px";
      iframe.style.width = doc.documentElement.scrollWidth + "px";
    } catch (_) {}
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const container = iframe.closest(".reading-pane-container");

    // Reset height so the old email's height doesn't persist
    iframe.style.height = "0";

    // Scroll the reading pane back to top
    if (container) container.scrollTop = 0;

    let resizeObs: ResizeObserver | null = null;
    let mutObs: MutationObserver | null = null;

    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          highlightIframe(doc, terms);
          // Watch for late-loading content (images, fonts, etc.)
          mutObs = new MutationObserver(syncIframeSize);
          mutObs.observe(doc.body, { childList: true, subtree: true, attributes: true });
          // Catch image/resource loads that change layout
          doc.querySelectorAll("img").forEach((img) => {
            if (!img.complete) img.addEventListener("load", syncIframeSize);
          });
        }
      } catch (_) { /* cross-origin safety */ }
      syncIframeSize();
    };

    iframe.addEventListener("load", onLoad);

    // If already loaded (cached), run immediately
    try {
      const doc = iframe.contentDocument;
      if (doc?.body?.childNodes.length) {
        highlightIframe(doc, terms);
        syncIframeSize();
      }
    } catch (_) {}

    // Re-measure when the reading pane container resizes
    if (container) {
      resizeObs = new ResizeObserver(syncIframeSize);
      resizeObs.observe(container);
    }

    return () => {
      iframe.removeEventListener("load", onLoad);
      resizeObs?.disconnect();
      mutObs?.disconnect();
    };
  }, [email.Payload.ID, searchQuery.value, syncIframeSize]);

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
          class="reading-iframe"
          sandbox="allow-same-origin"
          scrolling="no"
        />
      </div>
    </div>
  );
}
