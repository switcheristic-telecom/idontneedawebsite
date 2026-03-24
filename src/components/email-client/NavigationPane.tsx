import { selectedFolder } from "../../data/store";

export function NavigationPane({
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
    <div class="nav-tree-scroll">
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
        <div class="folder-root">
          &#128193; Personal Folders
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128193;</span> Deleted Items
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128193;</span> Drafts
        </div>
        <div
          class={`folder-item bold folder-item--nested ${folder === "inbox" ? "active" : ""}`}
          onClick={() => (selectedFolder.value = "inbox")}
        >
          <span class="folder-icon">&#128229;</span>
          <span>Inbox</span>
          <span class="folder-count">({emailCount})</span>
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128293;</span> Junk E-mail
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128193;</span> Outbox
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128193;</span> RSS Feeds
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128193;</span> Sent Items
        </div>
        <div class="folder-item folder-item--disabled">
          <span class="folder-icon">&#128270;</span> Search Folders
        </div>
        <div
          class={`folder-item folder-item--nested ${folder === "calls" ? "active" : ""}`}
          onClick={() => (selectedFolder.value = "calls")}
        >
          <span class="folder-icon">&#128222;</span>
          <span>Missed Calls</span>
          <span class="folder-count">({missedCount})</span>
        </div>
        <div
          class={`folder-item folder-item--nested ${folder === "voicemail" ? "active" : ""}`}
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
