import type { EmailMetadata } from "../types";

const IGNORE_SENDERS = ["proton.me"];
const IGNORE_IDS = [
  "Tz3yiKX_ahgueIP-aI7S8B6DkFAWLcID3Dobp2_5LcFllv8dLSfkGewulUtXVGM9z2byXqyvob4hzvfWWc9jPw==",
];

export async function loadEmails(): Promise<EmailMetadata[]> {
  const res = await fetch("/email-metadata.json");
  const data: EmailMetadata[] = await res.json();

  return data
    .filter((email) => {
      const addr = email.Payload.Sender.Address;
      if (IGNORE_SENDERS.some((s) => addr.includes(s))) return false;
      if (IGNORE_IDS.includes(email.Payload.ID)) return false;
      return true;
    })
    .sort((a, b) => a.Payload.Time - b.Payload.Time);
}
