import type { EmailMetadata } from "../../types";

export function EmailPopup(_props: { windowId: string; props?: Record<string, unknown> }) {
  const email = _props.props?.email as EmailMetadata | undefined;
  if (!email) return <div class="p-4">Email not found</div>;

  return (
    <div class="flex flex-col h-full bg-win-bg text-[11px] font-win">
      {/* Header */}
      <div class="bg-win-bg p-2 border-b border-gray-400 shrink-0">
        <div class="flex gap-2">
          <span class="font-bold w-[50px] text-right">From:</span>
          <span>
            {email.Payload.Sender.Name} &lt;{email.Payload.Sender.Address}&gt;
          </span>
        </div>
        <div class="flex gap-2">
          <span class="font-bold w-[50px] text-right">Date:</span>
          <span>{new Date(email.Payload.Time * 1000).toLocaleString()}</span>
        </div>
        <div class="flex gap-2">
          <span class="font-bold w-[50px] text-right">To:</span>
          <span>
            {email.Payload.ToList.map((t) => t.Address).join(", ") || "—"}
          </span>
        </div>
        {email.Payload.CCList.length > 0 && (
          <div class="flex gap-2">
            <span class="font-bold w-[50px] text-right">CC:</span>
            <span>{email.Payload.CCList.map((c) => c.Address).join(", ")}</span>
          </div>
        )}
        <div class="flex gap-2">
          <span class="font-bold w-[50px] text-right">Subject:</span>
          <span class="font-bold">{email.Payload.Subject}</span>
        </div>
      </div>

      {/* Email body */}
      <iframe
        src={`/emails/${email.Payload.ID}.html`}
        class="flex-1 w-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
