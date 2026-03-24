import type { EmailMetadata } from "../../types";

export function ReadingPane({ email }: { email: EmailMetadata }) {
  return (
    <div class="email-client-content">
      {/* Email headers - Outlook 2007 style */}
      <div class="reading-header">
        <div class="subject-line">{email.Payload.Subject}</div>
        <div class="header-field-row">
          <span class="field-label">From:</span>
          <span class="field-value">
            {email.Payload.Sender.Name} [{email.Payload.Sender.Address}]
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
            {email.Payload.ToList.map((t) => t.Name || t.Address).join(", ") || "\u2014"}
          </span>
        </div>
        {email.Payload.CCList.length > 0 && (
          <div class="header-field-row">
            <span class="field-label">CC:</span>
            <span class="field-value">
              {email.Payload.CCList.map((c) => c.Address).join(", ")}
            </span>
          </div>
        )}
      </div>
      {/* Email body iframe */}
      <div class="reading-body">
        <iframe
          src={`/emails/${email.Payload.ID}.html`}
          width="100%"
          height="100%"
          class="reading-iframe"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
