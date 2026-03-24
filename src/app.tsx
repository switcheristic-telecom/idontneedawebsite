import { useEffect } from "preact/hooks";
import {
  emails,
  calls,
  activeTab,
} from "./data/store";
import { loadEmails } from "./data/emails";
import { loadCalls } from "./data/calls";
import { EmailClient } from "./components/email-client/EmailClient";
import { CalendarWindow } from "./components/calendar/CalendarWindow";

export function App() {
  useEffect(() => {
    loadEmails().then((data) => { emails.value = data; });
    loadCalls().catch(() => { calls.value = []; });
  }, []);

  const tab = activeTab.value;

  return (
    <>
      {/* Mobile warning */}
      <div class="mobile-warning">
        <div class="mobile-warning-dialog">
          <div class="mobile-warning-titlebar">
            &#9888; Resolution Warning
          </div>
          <div class="mobile-warning-body">
            <p>
              This page is best viewed at 1024&times;768 resolution<br />
              with Internet Explorer 7.0 or higher
            </p>
            <hr />
            <p style={{ fontWeight: "normal", textAlign: "left" }}>
              <b>idontneedawebsite.us</b> is a case study documenting spam
              received after registering a .US domain.
            </p>
            <p class="mobile-warning-footer">
              A Switcheristic Telecommunications project<br />
              &copy; 2024 Webb Notneeded
            </p>
          </div>
        </div>
      </div>

      {/* Desktop background */}
      <div class="vista-desktop">
        {/* Window frame */}
        <div class="aero-window main-app">
        {/* Title bar */}
        <div class="titlebar">
          <span>&#128231; Inbox - idontneedawebsite Mail</span>
        </div>

        {/* Menu bar */}
        <div class="menubar">
          <span><u>F</u>ile</span>
          <span><u>E</u>dit</span>
          <span><u>V</u>iew</span>
          <span><u>G</u>o</span>
          <span><u>T</u>ools</span>
          <span><u>A</u>ctions</span>
          <span><u>H</u>elp</span>
        </div>

        {/* Toolbar */}
        <div class="toolbar">
          <span class="toolbar-btn">&#128232; Send/Receive</span>
          <span class="toolbar-sep" />
          <span class="toolbar-btn">&#128221; New</span>
          <span class="toolbar-sep" />
          <span class="toolbar-btn">&#8617;&#65039; Reply</span>
          <span class="toolbar-btn">&#8617;&#65039; Reply to All</span>
          <span class="toolbar-btn">&#10145;&#65039; Forward</span>
          <span class="toolbar-sep" />
          <span class="toolbar-btn">&#128465;&#65039; Delete</span>
          <span class="toolbar-sep" />
          <span class="toolbar-btn">&#128206; Address Book</span>
        </div>

        {/* Search bar */}
        <div class="search-bar">
          <span class="search-bar-hint">
            Type a question for help
          </span>
          <span>Search Inbox</span>
          <input type="text" placeholder="" readOnly />
          <span class="search-bar-icon">&#128269;</span>
        </div>

        {/* Content area with sidebar */}
        <div class="content-area">
          {/* Navigation pane */}
          <div class="nav-pane">
            {tab === "inbox" ? (
              <EmailClient mode="nav" />
            ) : (
              <div class="nav-placeholder">
                Calendar View
              </div>
            )}

            {/* Navigation buttons */}
            <div class="nav-buttons">
              <div
                class={`nav-btn ${tab === "inbox" ? "active" : ""}`}
                onClick={() => activeTab.value = "inbox"}
              >
                <span class="nav-icon">&#128231;</span> Mail
              </div>
              <div
                class={`nav-btn ${tab === "calendar" ? "active" : ""}`}
                onClick={() => activeTab.value = "calendar"}
              >
                <span class="nav-icon">&#128197;</span> Calendar
              </div>
              <div class="nav-btn-mini-row">
                <div class="nav-btn-mini" title="Contacts">&#128101;</div>
                <div class="nav-btn-mini" title="Tasks">&#9745;</div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div class="content-main">
            {tab === "inbox" && <EmailClient mode="content" />}
            {tab === "calendar" && <CalendarWindow />}
          </div>
        </div>

        {/* Status bar */}
        <div class="statusbar">
          <span class="statusbar-panel">
            {tab === "inbox" ? `${emails.value.length} Items` : "Spam Calendar"}
          </span>
        </div>
        </div>
      </div>
    </>
  );
}
