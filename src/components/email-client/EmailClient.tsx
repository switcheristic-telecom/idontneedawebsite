import {
  emails,
  calls,
  selectedFolder,
  selectedEmailId,
  sortBy,
  sortAsc,
  searchQuery,
  searchIndex,
  loadSearchIndex,
} from "../../data/store";
import { AboutPane } from "../about/AboutPane";
import { NavigationPane } from "./NavigationPane";
import { EmailTable, ABOUT_ID } from "./EmailTable";
import { CallTable } from "./CallTable";
import { ReadingPane } from "./ReadingPane";
import { IconInbox, IconSearch } from "../VistaIcons";

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

  // Filter by search query — all terms must match (AND logic)
  const rawQuery = searchQuery.value.toLowerCase().trim();
  const terms = rawQuery ? rawQuery.split(/\s+/) : [];
  const idx = searchIndex.value;
  const filtered = terms.length
    ? sorted.filter((e) => {
        const meta =
          (e.Payload.Subject + " " + e.Payload.Sender.Name + " " + e.Payload.Sender.Address)
            .toLowerCase();
        const body = idx ? (idx[e.Payload.ID] ?? "") : "";
        const haystack = meta + " " + body;
        return terms.every((t) => haystack.includes(t));
      })
    : sorted;

  const arrow = (col: string) =>
    sortBy.value === col ? (sortAsc.value ? " \u25B2" : " \u25BC") : "";

  const selId = selectedEmailId.value;
  const isAbout = selId === ABOUT_ID;
  const selected = isAbout
    ? null
    : emailList.find((e) => e.Payload.ID === selId);

  const sortLabel =
    sortBy.value === "date" ? "Date" : sortBy.value === "from" ? "From" : "Subject";
  const sortOrder = sortBy.value === "date"
    ? (sortAsc.value ? "Oldest on top" : "Newest on top")
    : (sortAsc.value ? "A on top" : "Z on top");

  return (
    <div class="email-client-content">
      {/* Message list */}
      <div class="panel-inset message-list-pane">
        {/* Card-layout header — visible only in wide mode */}
        <div class="card-list-header">
          <div class="card-list-title">
            <IconInbox /> Inbox
          </div>
          <div class="card-list-search">
            <IconSearch />
            <input
              type="text"
              class="card-search-input"
              placeholder="Search Inbox"
              value={searchQuery.value}
              onInput={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
                loadSearchIndex();
              }}
            />
          </div>
          <div class="card-list-sort">
            <span
              class="card-sort-btn"
              onClick={() => {
                const cols: Array<"date" | "from" | "subject"> = ["date", "from", "subject"];
                const i = cols.indexOf(sortBy.value);
                sortBy.value = cols[(i + 1) % cols.length];
              }}
            >
              Arranged By: <b>{sortLabel}</b>
            </span>
            <span
              class="card-sort-btn"
              onClick={() => { sortAsc.value = !sortAsc.value; }}
            >
              {sortOrder}
            </span>
          </div>
        </div>
        {folder === "inbox" ? (
          <EmailTable
            emails={filtered}
            selectedId={selId}
            onSelect={(id) => (selectedEmailId.value = id)}
            onSort={handleSort}
            arrow={arrow}
            groupBy={sortBy.value}
          />
        ) : (
          <CallTable
            calls={folder === "voicemail" ? voicemails : missedCalls}
          />
        )}
      </div>

      {/* Reading pane */}
      <div class="panel-inset reading-pane-container">
        {isAbout ? (
          <div class="reading-pane-scroll">
            <AboutPane />
          </div>
        ) : folder === "inbox" && selected ? (
          <ReadingPane email={selected} />
        ) : (
          <div class="empty-pane-message">
            {folder === "inbox"
              ? "Click a message to read it"
              : "Select a folder on the left"}
          </div>
        )}
      </div>
    </div>
  );
}
