import { useState } from "preact/hooks";
import { emails, calls, selectedFolder, selectedEmailId, openWindow } from "../../data/store";
import type { EmailMetadata, CallMetadata } from "../../types";

export function EmailClient(_props: { windowId: string; props?: Record<string, unknown> }) {
  const [sortBy, setSortBy] = useState<"date" | "from" | "subject">("date");
  const [sortAsc, setSortAsc] = useState(true);

  const folder = selectedFolder.value;
  const emailList = emails.value;
  const callList = calls.value;

  const missedCalls = callList.filter((c) => c.type === "Missed");
  const voicemails = callList.filter((c) => c.type === "Voicemail");

  const handleSort = (col: "date" | "from" | "subject") => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  const sortedEmails = [...emailList].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "date") cmp = a.Payload.Time - b.Payload.Time;
    else if (sortBy === "from")
      cmp = a.Payload.Sender.Address.localeCompare(b.Payload.Sender.Address);
    else if (sortBy === "subject")
      cmp = a.Payload.Subject.localeCompare(b.Payload.Subject);
    return sortAsc ? cmp : -cmp;
  });

  const sortIndicator = (col: string) =>
    sortBy === col ? (sortAsc ? " ▲" : " ▼") : "";

  const selectedEmail = emailList.find(
    (e) => e.Payload.ID === selectedEmailId.value
  );

  const openEmailPopup = (email: EmailMetadata) => {
    openWindow("email-popup", email.Payload.Subject, {
      props: { emailId: email.Payload.ID, email },
    });
  };

  return (
    <div class="flex flex-col h-full bg-win-bg text-[11px] font-win">
      {/* Menu bar */}
      <div class="win95-menubar shrink-0">
        <span class="win95-menu-item"><u>F</u>ile</span>
        <span class="win95-menu-item"><u>E</u>dit</span>
        <span class="win95-menu-item"><u>V</u>iew</span>
        <span class="win95-menu-item"><u>T</u>ools</span>
        <span class="win95-menu-item"><u>H</u>elp</span>
      </div>

      {/* Toolbar */}
      <div class="win95-toolbar shrink-0">
        <div class="win95-toolbar-btn">
          <span class="text-base">📨</span>
          <span>Send/Recv</span>
        </div>
        <div class="win95-toolbar-sep" />
        <div class="win95-toolbar-btn">
          <span class="text-base">📝</span>
          <span>New Mail</span>
        </div>
        <div class="win95-toolbar-btn">
          <span class="text-base">↩️</span>
          <span>Reply</span>
        </div>
        <div class="win95-toolbar-btn">
          <span class="text-base">↩️</span>
          <span>Reply All</span>
        </div>
        <div class="win95-toolbar-btn">
          <span class="text-base">➡️</span>
          <span>Forward</span>
        </div>
        <div class="win95-toolbar-sep" />
        <div class="win95-toolbar-btn">
          <span class="text-base">🗑️</span>
          <span>Delete</span>
        </div>
      </div>

      {/* Main area: folder tree + email list + reading pane */}
      <div class="flex flex-1 overflow-hidden">
        {/* Folder tree */}
        <div class="w-[160px] shrink-0 win95-inset bg-white m-1 overflow-y-auto win95-scroll">
          <div class="p-1">
            <FolderItem
              icon="📂"
              label={`Inbox (${emailList.length})`}
              active={folder === "inbox"}
              onClick={() => selectedFolder.value = "inbox"}
            />
            <FolderItem
              icon="📞"
              label={`Missed Calls (${missedCalls.length})`}
              active={folder === "calls"}
              onClick={() => selectedFolder.value = "calls"}
            />
            <FolderItem
              icon="📱"
              label={`Voicemail (${voicemails.length})`}
              active={folder === "voicemail"}
              onClick={() => selectedFolder.value = "voicemail"}
            />
          </div>
        </div>

        {/* Right side: list + reading pane */}
        <div class="flex-1 flex flex-col overflow-hidden">
          {/* Email/Call list */}
          <div class="h-[45%] shrink-0 win95-inset bg-white m-1 mt-1 mr-1 overflow-hidden flex flex-col">
            {folder === "inbox" ? (
              <EmailListView
                emails={sortedEmails}
                selectedId={selectedEmailId.value}
                onSelect={(id) => (selectedEmailId.value = id)}
                onOpen={openEmailPopup}
                onSort={handleSort}
                sortIndicator={sortIndicator}
              />
            ) : (
              <CallListView
                calls={folder === "voicemail" ? voicemails : missedCalls}
              />
            )}
          </div>

          {/* Reading pane */}
          <div class="flex-1 win95-inset bg-white m-1 mt-0 mr-1 overflow-hidden flex flex-col">
            {folder === "inbox" && selectedEmail ? (
              <ReadingPane email={selectedEmail} />
            ) : (
              <div class="flex items-center justify-center h-full text-gray-500 text-[11px]">
                {folder === "inbox"
                  ? "Select an email to read"
                  : "Call details not available in preview"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div class="win95-statusbar shrink-0">
        <div class="win95-statusbar-panel">
          {folder === "inbox"
            ? `${emailList.length} message(s)`
            : folder === "calls"
              ? `${missedCalls.length} missed call(s)`
              : `${voicemails.length} voicemail(s)`}
        </div>
        <div class="win95-statusbar-panel" style={{ flex: "0 0 200px" }}>
          idontneedawebsite@proton.me
        </div>
      </div>
    </div>
  );
}

function FolderItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      class={`flex items-center gap-1 px-1 py-[2px] cursor-pointer ${
        active ? "bg-win-highlight text-win-highlight-text" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function EmailListView({
  emails,
  selectedId,
  onSelect,
  onOpen,
  onSort,
  sortIndicator,
}: {
  emails: EmailMetadata[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (email: EmailMetadata) => void;
  onSort: (col: "date" | "from" | "subject") => void;
  sortIndicator: (col: string) => string;
}) {
  return (
    <>
      {/* Column headers */}
      <div class="flex bg-win-bg border-b border-gray-400 shrink-0 select-none">
        <div
          class="w-[30%] px-2 py-[2px] border-r border-gray-300 cursor-pointer win95-outset"
          style={{ borderWidth: "1px" }}
          onClick={() => onSort("from")}
        >
          From{sortIndicator("from")}
        </div>
        <div
          class="flex-1 px-2 py-[2px] border-r border-gray-300 cursor-pointer win95-outset"
          style={{ borderWidth: "1px" }}
          onClick={() => onSort("subject")}
        >
          Subject{sortIndicator("subject")}
        </div>
        <div
          class="w-[20%] px-2 py-[2px] cursor-pointer win95-outset"
          style={{ borderWidth: "1px" }}
          onClick={() => onSort("date")}
        >
          Date{sortIndicator("date")}
        </div>
      </div>
      {/* Email rows */}
      <div class="flex-1 overflow-y-auto win95-scroll">
        {emails.map((email) => (
          <div
            key={email.Payload.ID}
            class={`flex cursor-pointer border-b border-gray-100 ${
              selectedId === email.Payload.ID
                ? "bg-win-highlight text-white"
                : "hover:bg-blue-50"
            }`}
            onClick={() => onSelect(email.Payload.ID)}
            onDblClick={() => onOpen(email)}
          >
            <div class="w-[30%] px-2 py-[1px] truncate">
              {email.Payload.Sender.Name || email.Payload.Sender.Address}
            </div>
            <div class="flex-1 px-2 py-[1px] truncate">
              {email.Payload.Subject}
            </div>
            <div class="w-[20%] px-2 py-[1px] truncate">
              {new Date(email.Payload.Time * 1000).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CallListView({ calls }: { calls: CallMetadata[] }) {
  return (
    <>
      <div class="flex bg-win-bg border-b border-gray-400 shrink-0 select-none">
        <div class="w-[40%] px-2 py-[2px] border-r border-gray-300 win95-outset" style={{ borderWidth: "1px" }}>
          Phone Number
        </div>
        <div class="w-[30%] px-2 py-[2px] border-r border-gray-300 win95-outset" style={{ borderWidth: "1px" }}>
          Type
        </div>
        <div class="flex-1 px-2 py-[2px] win95-outset" style={{ borderWidth: "1px" }}>
          Date
        </div>
      </div>
      <div class="flex-1 overflow-y-auto win95-scroll">
        {calls.map((call, i) => (
          <div key={i} class="flex border-b border-gray-100 hover:bg-blue-50">
            <div class="w-[40%] px-2 py-[1px] truncate">{call.phone}</div>
            <div class="w-[30%] px-2 py-[1px]">{call.type}</div>
            <div class="flex-1 px-2 py-[1px] truncate">
              {new Date(call.time).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ReadingPane({ email }: { email: EmailMetadata }) {
  return (
    <>
      <div class="bg-win-bg p-2 border-b border-gray-300 shrink-0 text-[11px]">
        <div>
          <b>From:</b> {email.Payload.Sender.Name}{" "}
          &lt;{email.Payload.Sender.Address}&gt;
        </div>
        <div>
          <b>To:</b>{" "}
          {email.Payload.ToList.map((t) => t.Address).join(", ") || "—"}
        </div>
        {email.Payload.CCList.length > 0 && (
          <div>
            <b>CC:</b> {email.Payload.CCList.map((t) => t.Address).join(", ")}
          </div>
        )}
        <div>
          <b>Subject:</b> {email.Payload.Subject}
        </div>
        <div>
          <b>Date:</b>{" "}
          {new Date(email.Payload.Time * 1000).toLocaleString()}
        </div>
      </div>
      <iframe
        src={`/emails/${email.Payload.ID}.html`}
        class="flex-1 w-full border-0"
        sandbox="allow-same-origin"
      />
    </>
  );
}
