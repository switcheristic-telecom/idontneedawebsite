import { useMemo } from "preact/hooks";
import { useSignal } from "@preact/signals";
import {
  emails,
  calls,
  showAddressBook,
  selectedFolder,
  selectedEmailId,
  searchQuery,
  activeTab,
} from "../../data/store";
import { formatPhoneNumber } from "../email-client/utils";
import { IconAddressBook, IconMail, IconPhone } from "../VistaIcons";

interface Contact {
  name: string;
  address: string;
  type: "email" | "phone";
  count: number;
  firstSeen: number;
  lastSeen: number;
}

export function AddressBookWindow() {
  const visible = showAddressBook.value;
  const sortCol = useSignal<"name" | "address" | "type" | "count">("count");
  const sortAsc = useSignal(false);
  const filter = useSignal("");
  const selectedContact = useSignal<string | null>(null);

  const contacts = useMemo(() => {
    const map = new Map<string, Contact>();

    for (const e of emails.value) {
      const key = `email:${e.Payload.Sender.Address.toLowerCase()}`;
      const existing = map.get(key);
      const ts = e.Payload.Time;
      if (existing) {
        existing.count++;
        if (ts < existing.firstSeen) existing.firstSeen = ts;
        if (ts > existing.lastSeen) existing.lastSeen = ts;
        if (!existing.name && e.Payload.Sender.Name) {
          existing.name = e.Payload.Sender.Name;
        }
      } else {
        map.set(key, {
          name: e.Payload.Sender.Name || "",
          address: e.Payload.Sender.Address,
          type: "email",
          count: 1,
          firstSeen: ts,
          lastSeen: ts,
        });
      }
    }

    for (const c of calls.value) {
      const key = `phone:${c.phone}`;
      const ts = Math.floor(new Date(c.time).getTime() / 1000);
      const existing = map.get(key);
      if (existing) {
        existing.count++;
        if (ts < existing.firstSeen) existing.firstSeen = ts;
        if (ts > existing.lastSeen) existing.lastSeen = ts;
      } else {
        map.set(key, {
          name: "",
          address: c.phone,
          type: "phone",
          count: 1,
          firstSeen: ts,
          lastSeen: ts,
        });
      }
    }

    return Array.from(map.values());
  }, [emails.value, calls.value]);

  if (!visible) return null;

  const query = filter.value.toLowerCase();
  const filtered = query
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query)
      )
    : contacts;

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol.value === "name") cmp = (a.name || a.address).localeCompare(b.name || b.address);
    else if (sortCol.value === "address") cmp = a.address.localeCompare(b.address);
    else if (sortCol.value === "type") cmp = a.type.localeCompare(b.type);
    else cmp = a.count - b.count;
    return sortAsc.value ? cmp : -cmp;
  });

  const handleSort = (col: "name" | "address" | "type" | "count") => {
    if (sortCol.value === col) {
      sortAsc.value = !sortAsc.value;
    } else {
      sortCol.value = col;
      sortAsc.value = col === "name" || col === "address";
    }
  };

  const arrow = (col: string) =>
    sortCol.value === col ? (sortAsc.value ? " \u25B2" : " \u25BC") : "";

  const handleContactClick = (contact: Contact) => {
    selectedContact.value = `${contact.type}:${contact.address}`;
  };

  const handleGoTo = () => {
    const sel = selectedContact.value;
    if (!sel) return;
    const contact = contacts.find((c) => `${c.type}:${c.address}` === sel);
    if (!contact) return;

    if (contact.type === "email") {
      activeTab.value = "inbox";
      selectedFolder.value = "inbox";
      searchQuery.value = contact.address;
      selectedEmailId.value = null;
    } else {
      activeTab.value = "inbox";
      selectedFolder.value = "calls";
    }
    showAddressBook.value = false;
  };

  return (
    <div class="ab-overlay" onClick={() => (showAddressBook.value = false)}>
      {/* Glass frame — mirrors .aero-frame */}
      <div class="ab-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Title bar — transparent, on the glass */}
        <div class="ab-titlebar">
          <span class="ab-titlebar-icon"><IconAddressBook /></span>
          <span class="ab-titlebar-text">Address Book - idontneedawebsite Contacts</span>
          <div class="window-controls">
            <button class="wc-btn wc-minimize" title="Minimize" aria-label="Minimize">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <line x1="1" y1="7" x2="9" y2="7" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                <line x1="1" y1="7" x2="9" y2="7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <button class="wc-btn wc-maximize" title="Maximize" aria-label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#333333" stroke-width="2.5" />
                <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#fff" stroke-width="1.5" />
              </svg>
            </button>
            <button
              class="wc-btn wc-close"
              title="Close"
              aria-label="Close"
              onClick={() => (showAddressBook.value = false)}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Opaque window content */}
        <div class="ab-window">
          {/* Toolbar */}
          <div class="ab-toolbar">
            <input
              type="text"
              class="ab-search"
              placeholder="Search contacts..."
              value={filter.value}
              onInput={(e) => (filter.value = (e.target as HTMLInputElement).value)}
            />
            <button class="ab-goto-btn" disabled={!selectedContact.value} onClick={handleGoTo}>
              Go to Messages &raquo;
            </button>
          </div>

          {/* Contact list */}
          <div class="ab-list-container">
            <table class="ab-table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th class="ab-col-icon">&nbsp;</th>
                  <th class="ab-col-name" onClick={() => handleSort("name")}>
                    Display Name{arrow("name")}
                  </th>
                  <th class="ab-col-address" onClick={() => handleSort("address")}>
                    E-mail / Phone{arrow("address")}
                  </th>
                  <th class="ab-col-count" onClick={() => handleSort("count")}>
                    Messages{arrow("count")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((contact) => {
                  const key = `${contact.type}:${contact.address}`;
                  const isSelected = selectedContact.value === key;
                  return (
                    <tr
                      key={key}
                      class={`ab-row ${isSelected ? "selected" : ""}`}
                      onClick={() => handleContactClick(contact)}
                      onDblClick={() => {
                        handleContactClick(contact);
                        handleGoTo();
                      }}
                    >
                      <td class="ab-cell-icon">
                        {contact.type === "email" ? <IconMail /> : <IconPhone />}
                      </td>
                      <td class="ab-cell-name">
                        {contact.name ||
                          (contact.type === "phone"
                            ? formatPhoneNumber(contact.address)
                            : contact.address)}
                      </td>
                      <td class="ab-cell-address">
                        <span class="ab-address-text">
                          {contact.type === "phone"
                            ? formatPhoneNumber(contact.address)
                            : contact.address}
                        </span>
                        <a
                          href={contact.type === "email" ? `mailto:${contact.address}` : `tel:${contact.address}`}
                          class="ab-external-link"
                          title={contact.type === "email" ? `Send email to ${contact.address}` : `Call ${contact.address}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12">
                            <path d="M3.5 1.5H1.5V10.5H10.5V8.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
                            <path d="M6.5 1.5H10.5V5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            <line x1="10.5" y1="1.5" x2="5.5" y2="6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
                          </svg>
                        </a>
                      </td>
                      <td class="ab-cell-count">{contact.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status bar — on the glass frame */}
        <div class="ab-statusbar">
          {sorted.length} contact{sorted.length !== 1 ? "s" : ""} shown
          {query ? ` (${contacts.length} total)` : ""}
        </div>
      </div>
    </div>
  );
}
