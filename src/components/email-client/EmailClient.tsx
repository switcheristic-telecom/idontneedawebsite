import {
  emails,
  calls,
  selectedFolder,
  selectedEmailId,
  selectedCallId,
  sortBy,
  sortAsc,
  searchQuery,
  searchIndex,
  loadSearchIndex,
  filteredCount,
  callDateFilter,
} from "../../data/store";
import { parseSearchQuery } from "../../utils/parseSearchQuery";
import { AboutPane } from "../about/AboutPane";
import { NavigationPane } from "./NavigationPane";
import { EmailTable, ABOUT_ID } from "./EmailTable";
import { CallTable } from "./CallTable";
import { CallDetailPane } from "./CallDetailPane";
import { ReadingPane } from "./ReadingPane";
import { getCallId } from "./utils";
import { IconInbox, IconPhone, IconVoicemail, IconSearch } from "../VistaIcons";

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

  // Filter by search query — supports from:, to:, date: operators + plain terms (AND)
  const parsed = parseSearchQuery(searchQuery.value);
  const hasQuery =
    parsed.terms.length > 0 || parsed.from.length > 0 || parsed.to.length > 0 || parsed.date.length > 0;
  const idx = searchIndex.value;
  const filtered = hasQuery
    ? sorted.filter((e) => {
        const sender = e.Payload.Sender;
        const senderStr = (sender.Name + " " + sender.Address).toLowerCase();
        if (parsed.from.length && !parsed.from.every((f) => senderStr.includes(f))) return false;

        if (parsed.to.length) {
          const recipients = [...e.Payload.ToList, ...e.Payload.CCList];
          const recipStr = recipients.map((r) => (r.Name + " " + r.Address).toLowerCase()).join(" ");
          if (!parsed.to.every((t) => recipStr.includes(t))) return false;
        }

        if (parsed.date.length) {
          const dateStr = new Date(e.Payload.Time * 1000).toISOString().split("T")[0];
          if (!parsed.date.every((d) => dateStr.startsWith(d))) return false;
        }

        if (parsed.terms.length) {
          const meta = (e.Payload.Subject + " " + senderStr).toLowerCase();
          const body = idx ? (idx[e.Payload.ID] ?? "") : "";
          const haystack = meta + " " + body;
          if (!parsed.terms.every((t) => haystack.includes(t))) return false;
        }

        return true;
      })
    : sorted;

  filteredCount.value = hasQuery ? filtered.length : null;

  const arrow = (col: string) =>
    sortBy.value === col ? (sortAsc.value ? " \u25B2" : " \u25BC") : "";

  const selId = selectedEmailId.value;
  const isAbout = selId === ABOUT_ID;
  const selected = isAbout
    ? null
    : emailList.find((e) => e.Payload.ID === selId);

  const rawCalls = folder === "voicemail" ? voicemails : missedCalls;
  const dateF = callDateFilter.value;
  const activeCalls = dateF
    ? rawCalls.filter((c) => new Date(c.time).toISOString().split("T")[0] === dateF)
    : rawCalls;
  const selectedCall = selectedCallId.value
    ? activeCalls.find((c) => getCallId(c) === selectedCallId.value) ?? null
    : null;

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
            {folder === "inbox" ? (
              <><IconInbox /> Inbox</>
            ) : folder === "voicemail" ? (
              <><IconVoicemail /> Voicemail</>
            ) : (
              <><IconPhone /> Missed Calls</>
            )}
          </div>
          {folder === "inbox" ? (
            <>
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
            </>
          ) : (
            <div class="card-list-sort">
              <span>Arranged By: <b>Date</b></span>
              <span>Oldest on top</span>
            </div>
          )}
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
            selectedId={selectedCallId.value}
            onSelect={(id) => (selectedCallId.value = id)}
          />
        )}
      </div>

      {/* Reading pane */}
      <div class="panel-inset reading-pane-container">
        {folder === "inbox" ? (
          isAbout ? (
            <div class="reading-pane-scroll">
              <AboutPane />
            </div>
          ) : selected ? (
            <ReadingPane email={selected} />
          ) : (
            <div class="empty-pane-message">Click a message to read it</div>
          )
        ) : selectedCall ? (
          <CallDetailPane call={selectedCall} />
        ) : (
          <div class="empty-pane-message">Click a call to view details</div>
        )}
      </div>
    </div>
  );
}
