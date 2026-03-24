import {
  emails,
  calls,
  selectedFolder,
  selectedEmailId,
  sortBy,
  sortAsc,
} from "../../data/store";
import type { EmailMetadata, CallMetadata } from "../../types";
import { AboutPane } from "../about/AboutPane";

const ABOUT_ID = "__about__";

export function EmailClient({ mode }: { mode: "nav" | "content" }) {
  const folder = selectedFolder.value;
  const emailList = emails.value;
  const callList = calls.value;

  const missedCalls = callList.filter((c) => c.type === "Missed");
  const voicemails = callList.filter((c) => c.type === "Voicemail");

  if (mode === "nav") {
    return (
      <NavigationPane
        folder={folder}
        emailCount={emailList.length}
        missedCount={missedCalls.length}
        voicemailCount={voicemails.length}
      />
    );
  }

  const handleSort = (col: "date" | "from" | "subject") => {
    if (sortBy.value === col) {
      sortAsc.value = !sortAsc.value;
    } else {
      sortBy.value = col;
      sortAsc.value = true;
    }
  };

  const sorted = [...emailList].sort((a, b) => {
    let cmp = 0;
    if (sortBy.value === "date") cmp = a.Payload.Time - b.Payload.Time;
    else if (sortBy.value === "from")
      cmp = a.Payload.Sender.Address.localeCompare(b.Payload.Sender.Address);
    else cmp = a.Payload.Subject.localeCompare(b.Payload.Subject);
    return sortAsc.value ? cmp : -cmp;
  });

  const arrow = (col: string) =>
    sortBy.value === col ? (sortAsc.value ? " \u25B2" : " \u25BC") : "";

  const selId = selectedEmailId.value;
  const isAbout = selId === ABOUT_ID;
  const selected = isAbout
    ? null
    : emailList.find((e) => e.Payload.ID === selId);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Message list */}
      <div
        class="panel-inset"
        style={{
          flex: "0 0 45%",
          overflow: "auto",
          margin: "2px",
        }}
      >
        {folder === "inbox" ? (
          <EmailTable
            emails={sorted}
            selectedId={selId}
            onSelect={(id) => (selectedEmailId.value = id)}
            onSort={handleSort}
            arrow={arrow}
          />
        ) : (
          <CallTable
            calls={folder === "voicemail" ? voicemails : missedCalls}
          />
        )}
      </div>

      {/* Reading pane */}
      <div
        class="panel-inset"
        style={{
          flex: 1,
          overflow: "hidden",
          margin: "0 2px 2px",
        }}
      >
        {isAbout ? (
          <div style={{ overflow: "auto", height: "100%" }}>
            <AboutPane />
          </div>
        ) : folder === "inbox" && selected ? (
          <ReadingPane email={selected} />
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#888",
          }}>
            {folder === "inbox"
              ? "Click a message to read it"
              : "Select a folder on the left"}
          </div>
        )}
      </div>
    </div>
  );
}

function NavigationPane({
  folder,
  emailCount,
  missedCount,
  voicemailCount,
}: {
  folder: string;
  emailCount: number;
  missedCount: number;
  voicemailCount: number;
}) {
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      {/* Favorite Folders */}
      <div class="nav-section-header">
        <span class="chevron">&#9660;</span> Favorite Folders
      </div>
      <div class="nav-folder-tree">
        <div
          class={`folder-item bold ${folder === "inbox" ? "active" : ""}`}
          onClick={() => (selectedFolder.value = "inbox")}
        >
          <span class="folder-icon">&#128229;</span>
          <span>Inbox</span>
          <span class="folder-count">({emailCount})</span>
        </div>
      </div>

      {/* All Mail Folders */}
      <div class="nav-section-header">
        <span class="chevron">&#9660;</span> All Mail Folders
      </div>
      <div class="nav-folder-tree">
        <div style={{ padding: "2px 6px 2px 10px", fontWeight: "bold", fontSize: "11px", color: "#333" }}>
          &#128193; Personal Folders
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128193;</span> Deleted Items
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128193;</span> Drafts
        </div>
        <div
          class={`folder-item bold ${folder === "inbox" ? "active" : ""}`}
          style={{ paddingLeft: "28px" }}
          onClick={() => (selectedFolder.value = "inbox")}
        >
          <span class="folder-icon">&#128229;</span>
          <span>Inbox</span>
          <span class="folder-count">({emailCount})</span>
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128293;</span> Junk E-mail
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128193;</span> Outbox
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128193;</span> RSS Feeds
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128193;</span> Sent Items
        </div>
        <div class="folder-item" style={{ paddingLeft: "28px", color: "#888", cursor: "default" }}>
          <span class="folder-icon">&#128270;</span> Search Folders
        </div>
        <div
          class={`folder-item ${folder === "calls" ? "active" : ""}`}
          style={{ paddingLeft: "28px" }}
          onClick={() => (selectedFolder.value = "calls")}
        >
          <span class="folder-icon">&#128222;</span>
          <span>Missed Calls</span>
          <span class="folder-count">({missedCount})</span>
        </div>
        <div
          class={`folder-item ${folder === "voicemail" ? "active" : ""}`}
          style={{ paddingLeft: "28px" }}
          onClick={() => (selectedFolder.value = "voicemail")}
        >
          <span class="folder-icon">&#128241;</span>
          <span>Voicemail</span>
          <span class="folder-count">({voicemailCount})</span>
        </div>
      </div>
    </div>
  );
}

function getDateGroup(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const emailDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - emailDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Date: Today";
  if (diffDays === 1) return "Date: Yesterday";
  if (diffDays <= 7) return "Date: Last Week";
  if (diffDays <= 14) return "Date: Two Weeks Ago";
  return "Date: Older";
}

function formatEmailDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const emailDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getDay()];
  const month = date.getMonth() + 1;
  const d = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const mins = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  if (today.getTime() === emailDay.getTime()) {
    return `${h12}:${mins} ${ampm}`;
  }
  return `${day} ${month}/${d}/${year} ${h12}:${mins} ${ampm}`;
}

function formatEmailSize(size: number): string {
  if (size < 1024) return `${size} B`;
  return `${Math.round(size / 1024)} KB`;
}

function EmailTable({
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
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th style={{ width: "4%" }} class="col-header">&nbsp;</th>
          <th style={{ width: "4%" }} class="col-header">&nbsp;</th>
          <th
            style={{ width: "24%" }}
            class="col-header"
            onClick={() => onSort("from")}
          >
            From{arrow("from")}
          </th>
          <th class="col-header" onClick={() => onSort("subject")}>
            Subject{arrow("subject")}
          </th>
          <th
            style={{ width: "20%" }}
            class="col-header"
            onClick={() => onSort("date")}
          >
            Received{arrow("date")}
          </th>
          <th style={{ width: "8%" }} class="col-header">Size</th>
        </tr>
      </thead>
      <tbody>
        {/* Pinned about row */}
        <tr
          class={`about-row ${selectedId === ABOUT_ID ? "selected" : ""}`}
          onClick={() => onSelect(ABOUT_ID)}
        >
          <td>&#128204;</td>
          <td></td>
          <td style={{ maxWidth: "200px" }}>Webb Notneeded</td>
          <td style={{ maxWidth: "300px" }}>
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
                <td>{email.Payload.NumAttachments > 0 ? "📎" : ""}</td>
                <td></td>
                <td style={{ maxWidth: "200px" }}>
                  {email.Payload.Sender.Name || email.Payload.Sender.Address}
                </td>
                <td style={{ maxWidth: "300px" }}>{email.Payload.Subject}</td>
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

function CallTable({ calls }: { calls: CallMetadata[] }) {
  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th style={{ width: "40%" }} class="col-header">Phone Number</th>
          <th style={{ width: "25%" }} class="col-header">Type</th>
          <th class="col-header">Date</th>
        </tr>
      </thead>
      <tbody>
        {calls.map((call, i) => (
          <tr key={i} class="email-row">
            <td style={{ padding: "2px 8px" }}>{call.phone}</td>
            <td style={{ padding: "2px 8px" }}>{call.type}</td>
            <td style={{ padding: "2px 8px" }}>
              {new Date(call.time).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReadingPane({ email }: { email: EmailMetadata }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Email headers - Outlook 2007 style */}
      <div class="reading-header">
        <div class="subject-line">{email.Payload.Subject}</div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
          <span class="field-label">From:</span>
          <span class="field-value">
            {email.Payload.Sender.Name} [{email.Payload.Sender.Address}]
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
          <span class="field-label">Sent:</span>
          <span class="field-value">
            {new Date(email.Payload.Time * 1000).toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <span class="field-label">To:</span>
          <span class="field-value">
            {email.Payload.ToList.map((t) => t.Name || t.Address).join(", ") || "\u2014"}
          </span>
        </div>
        {email.Payload.CCList.length > 0 && (
          <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
            <span class="field-label">CC:</span>
            <span class="field-value">
              {email.Payload.CCList.map((c) => c.Address).join(", ")}
            </span>
          </div>
        )}
      </div>
      {/* Email body iframe */}
      <div style={{ flex: 1 }}>
        <iframe
          src={`/emails/${email.Payload.ID}.html`}
          width="100%"
          height="100%"
          style={{ display: "block", border: "none" }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
