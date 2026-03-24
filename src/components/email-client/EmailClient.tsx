import {
  emails,
  calls,
  selectedFolder,
  selectedEmailId,
  sortBy,
  sortAsc,
} from "../../data/store";
import { AboutPane } from "../about/AboutPane";
import { NavigationPane } from "./NavigationPane";
import { EmailTable, ABOUT_ID } from "./EmailTable";
import { CallTable } from "./CallTable";
import { ReadingPane } from "./ReadingPane";

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
    <div class="email-client-content">
      {/* Message list */}
      <div class="panel-inset message-list-pane">
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
