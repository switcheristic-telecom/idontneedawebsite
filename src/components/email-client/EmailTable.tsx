import type { EmailMetadata } from "../../types";
import { getDateGroup, formatEmailDate, formatEmailSize } from "./utils";
import { IconPin, IconAttach } from "../VistaIcons";

export const ABOUT_ID = "__about__";

export function EmailTable({
  emails,
  selectedId,
  onSelect,
  onSort,
  arrow,
}: {
  emails: EmailMetadata[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSort: (col: "date" | "from" | "subject") => void;
  arrow: (col: string) => string;
}) {
  // Group emails by date
  const groups: { label: string; emails: EmailMetadata[] }[] = [];
  let currentGroup = "";

  for (const email of emails) {
    const group = getDateGroup(email.Payload.Time);
    if (group !== currentGroup) {
      currentGroup = group;
      groups.push({ label: group, emails: [] });
    }
    groups[groups.length - 1].emails.push(email);
  }

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" class="email-table">
      <thead>
        <tr>
          <th class="col-header col-icon">&nbsp;</th>
          <th class="col-header col-icon">&nbsp;</th>
          <th class="col-header col-from" onClick={() => onSort("from")}>
            From{arrow("from")}
          </th>
          <th class="col-header" onClick={() => onSort("subject")}>
            Subject{arrow("subject")}
          </th>
          <th class="col-header col-received" onClick={() => onSort("date")}>
            Received{arrow("date")}
          </th>
          <th class="col-header col-size">Size</th>
        </tr>
      </thead>
      <tbody>
        {/* Pinned about row */}
        <tr
          class={`about-row ${selectedId === ABOUT_ID ? "selected" : ""}`}
          onClick={() => onSelect(ABOUT_ID)}
        >
          <td><IconPin /></td>
          <td></td>
          <td class="cell-from">Webb Notneeded</td>
          <td class="cell-subject">
            Welcome to idontneedawebsite.us &mdash; Read Me First
          </td>
          <td>Sun 1/28/2024 3:29 PM</td>
          <td>4 KB</td>
        </tr>

        {/* Grouped emails */}
        {groups.map((group) => (
          <>
            <tr class="date-group-header" key={`group-${group.label}`}>
              <td colSpan={6}>{group.label}</td>
            </tr>
            {group.emails.map((email) => (
              <tr
                key={email.Payload.ID}
                class={`email-row ${selectedId === email.Payload.ID ? "selected" : ""}`}
                onClick={() => onSelect(email.Payload.ID)}
              >
                <td>{email.Payload.NumAttachments > 0 ? <IconAttach /> : ""}</td>
                <td></td>
                <td class="cell-from">
                  {email.Payload.Sender.Name || email.Payload.Sender.Address}
                </td>
                <td class="cell-subject">{email.Payload.Subject}</td>
                <td>{formatEmailDate(email.Payload.Time)}</td>
                <td>{formatEmailSize(email.Payload.Size)}</td>
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  );
}
