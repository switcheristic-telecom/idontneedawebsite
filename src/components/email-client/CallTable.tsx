import { useSignal } from "@preact/signals";
import type { CallMetadata } from "../../types";
import { getCallDateGroup, formatCallTime, formatPhoneNumber, getCallId } from "./utils";
import { IconPhone, IconVoicemail } from "../VistaIcons";

export function CallTable({
  calls,
  selectedId,
  onSelect,
}: {
  calls: CallMetadata[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const collapsed = useSignal<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    collapsed.value = { ...collapsed.value, [label]: !collapsed.value[label] };
  };

  // Group calls by date
  const groups: { label: string; calls: CallMetadata[] }[] = [];
  let currentGroup = "";

  for (const call of calls) {
    const group = getCallDateGroup(call.time);
    if (group !== currentGroup) {
      currentGroup = group;
      groups.push({ label: group, calls: [] });
    }
    groups[groups.length - 1].calls.push(call);
  }

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" class="email-table">
      <thead>
        <tr>
          <th class="col-header col-icon">&nbsp;</th>
          <th class="col-header col-icon">&nbsp;</th>
          <th class="col-header col-from">Phone Number</th>
          <th class="col-header">Type</th>
          <th class="col-header col-received">Date</th>
          <th class="col-header col-size">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => {
          const isCollapsed = collapsed.value[group.label];
          return (
            <>
              <tr
                class="date-group-header"
                key={`group-${group.label}`}
                onClick={() => toggleGroup(group.label)}
              >
                <td colSpan={6}>
                  <svg class="group-toggle" width="11" height="11" viewBox="0 0 11 11">
                    <defs>
                      <linearGradient id="toggleBg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#f8fbff" />
                        <stop offset="100%" stop-color="#d4e4f4" />
                      </linearGradient>
                      <filter id="toggleShadow">
                        <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" flood-color="#000" flood-opacity="0.15" />
                      </filter>
                    </defs>
                    <rect x="0.5" y="0.5" width="10" height="10" rx="1.5" fill="url(#toggleBg)" stroke="#7a9ab5" stroke-width="0.8" filter="url(#toggleShadow)" />
                    {isCollapsed && <rect x="4.5" y="2.5" width="1.5" height="6" rx="0.3" fill="#2b5278" />}
                    <rect x="2.5" y="4.5" width="6" height="1.5" rx="0.3" fill="#2b5278" />
                  </svg>
                  {group.label}
                </td>
              </tr>
              {!isCollapsed &&
                group.calls.map((call) => {
                  const id = getCallId(call);
                  return (
                    <tr
                      key={id}
                      class={`email-row ${selectedId === id ? "selected" : ""}`}
                      onClick={() => onSelect(id)}
                    >
                      <td></td>
                      <td></td>
                      <td class="cell-from">{formatPhoneNumber(call.phone)}</td>
                      <td class="cell-subject">
                        <span class="card-icon">
                          {call.type === "Voicemail" ? <IconVoicemail /> : <IconPhone />}
                        </span>
                        {call.type === "Voicemail" ? "Voicemail" : "Missed Call"}
                      </td>
                      <td>{formatCallTime(call.time)}</td>
                      <td></td>
                    </tr>
                  );
                })}
            </>
          );
        })}
      </tbody>
    </table>
  );
}
