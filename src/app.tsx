import { useEffect } from 'preact/hooks';
import { emails, calls, activeTab } from './data/store';
import { loadEmails } from './data/emails';
import { loadCalls } from './data/calls';
import { EmailClient } from './components/email-client/EmailClient';
import { CalendarWindow } from './components/calendar/CalendarWindow';
import { ContextMenu } from './components/ContextMenu';
import {
  IconMail,
  IconCalendar,
  IconSendReceive,
  IconNew,
  IconReply,
  IconReplyAll,
  IconForward,
  IconDelete,
  IconAddressBook,
} from './components/VistaIcons';

export function App() {
  useEffect(() => {
    loadEmails().then((data) => {
      emails.value = data;
    });
    loadCalls().catch(() => {
      calls.value = [];
    });
  }, []);

  const tab = activeTab.value;

  return (
    <>
      {/* Custom Vista context menu */}
      <ContextMenu />

      {/* Mobile warning */}
      <div class='mobile-warning'>
        <div class='mobile-warning-dialog'>
          <div class='mobile-warning-titlebar'>&#9888; Resolution Warning</div>
          <div class='mobile-warning-body'>
            <p>
              This page is best viewed at 1024&times;768 resolution
              <br />
              with Internet Explorer 7.0 or higher
            </p>
            <hr />
            <p style={{ fontWeight: 'normal', textAlign: 'left' }}>
              <b>idontneedawebsite.us</b> is a case study documenting spam
              received after registering a .US domain.
            </p>
            <p class='mobile-warning-footer'>
              A Switcheristic Telecommunications project
              <br />
              &copy; 2024 Webb Notneeded
            </p>
          </div>
        </div>
      </div>

      {/* Desktop background */}
      <div class='vista-desktop'>
        {/* Glass rim frame */}
        <div class='aero-frame'>
          {/* Title bar — part of the glass frame */}
          <div class='titlebar'>
            <span class='titlebar-icon'>
              <IconMail />
            </span>
            <span class='titlebar-text'>Inbox - idontneedawebsite Mail</span>
            <div class='window-controls'>
              <button class='wc-btn wc-minimize' title='Minimize' aria-label='Minimize'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="1" y="7" width="8" height="1.5" fill="currentColor" />
                </svg>
              </button>
              <button class='wc-btn wc-maximize' title='Maximize' aria-label='Maximize'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <rect x="1" y="1" width="8" height="2" fill="currentColor" />
                </svg>
              </button>
              <button class='wc-btn wc-close' title='Close' aria-label='Close'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Window content */}
          <div class='aero-window main-app'>
            {/* Menu bar */}
            <div class='menubar'>
              <span>
                <u>F</u>ile
              </span>
              <span>
                <u>E</u>dit
              </span>
              <span>
                <u>V</u>iew
              </span>
              <span>
                <u>G</u>o
              </span>
              <span>
                <u>T</u>ools
              </span>
              <span>
                <u>A</u>ctions
              </span>
              <span>
                <u>H</u>elp
              </span>
            </div>

            {/* Toolbar */}
            <div class='toolbar'>
              <span class='toolbar-btn'><IconSendReceive /> Send/Receive</span>
              <span class='toolbar-sep' />
              <span class='toolbar-btn'><IconNew /> New</span>
              <span class='toolbar-sep' />
              <span class='toolbar-btn'><IconReply /> Reply</span>
              <span class='toolbar-btn'><IconReplyAll /> Reply to All</span>
              <span class='toolbar-btn'><IconForward /> Forward</span>
              <span class='toolbar-sep' />
              <span class='toolbar-btn'><IconDelete /> Delete</span>
              <span class='toolbar-sep' />
              <span class='toolbar-btn'><IconAddressBook /> Address Book</span>
            </div>

            {/* Content area with sidebar */}
            <div class='content-area'>
              {/* Navigation pane */}
              <div class='nav-pane'>
                {tab === 'inbox' ? (
                  <EmailClient mode='nav' />
                ) : (
                  <div class='nav-placeholder'>Calendar View</div>
                )}

                {/* Navigation buttons */}
                <div class='nav-buttons'>
                  <div
                    class={`nav-btn ${tab === 'inbox' ? 'active' : ''}`}
                    onClick={() => (activeTab.value = 'inbox')}
                  >
                    <span class='nav-icon'><IconMail /></span> Mail
                  </div>
                  <div
                    class={`nav-btn ${tab === 'calendar' ? 'active' : ''}`}
                    onClick={() => (activeTab.value = 'calendar')}
                  >
                    <span class='nav-icon'><IconCalendar /></span> Calendar
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div class='content-main'>
                {tab === 'inbox' && <EmailClient mode='content' />}
                {tab === 'calendar' && <CalendarWindow />}
              </div>
            </div>
          </div>

          {/* Status bar — part of the glass frame */}
          <div class='statusbar'>
            <span class='statusbar-panel'>
              {tab === 'inbox'
                ? `${emails.value.length} Items`
                : 'Spam Calendar'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
