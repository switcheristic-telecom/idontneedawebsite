import { useSignal } from "@preact/signals";
import type { CallMetadata } from "../../types";
import { getCallDateGroup, formatCallTime, formatPhoneNumber, getCallId } from "./utils";
import { IconPhone, IconVoicemail, IconGroupToggle } from "../VistaIcons";

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
                  <IconGroupToggle collapsed={isCollapsed} />
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
