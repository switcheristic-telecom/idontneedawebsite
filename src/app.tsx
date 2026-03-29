import { useEffect } from 'preact/hooks';
import { Router } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { emails, calls, activeTab, filteredCount, showAddressBook } from './data/store';
import { loadEmails } from './data/emails';
import { loadCalls } from './data/calls';
import { useRouteSync } from './hooks/useRouteSync';
import { EmailClient } from './components/email-client/EmailClient';
import { CalendarWindow } from './components/calendar/CalendarWindow';
import { AddressBookWindow } from './components/address-book/AddressBookWindow';
import { AboutWindow } from './components/about/AboutWindow';
import { WelcomePopup } from './components/about/WelcomePopup';
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
  return (
    <Router hook={useHashLocation}>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  useRouteSync();

  useEffect(() => {
    loadEmails().then((data) => {
      emails.value = data;
    });
    loadCalls().then((data) => {
      calls.value = data;
    }).catch(() => {
      calls.value = [];
    });
  }, []);

  const tab = activeTab.value;

  return (
    <>
      {/* Custom Vista context menu */}
      <ContextMenu />
      {/* Address Book dialog */}
      <AddressBookWindow />
      {/* About window */}
      <AboutWindow />
      {/* Welcome popup — shown on startup */}
      <WelcomePopup />


      {/* Desktop background */}
      <div class='vista-desktop'>
        {/* Glass rim frame */}
        <div class='aero-frame'>
          {/* Title bar — part of the glass frame */}
          <div class='titlebar'>
            <span class='titlebar-icon'>
              <IconMail />
            </span>
            <span class='titlebar-text'>Inbox - idontneedawebsite Mail (Jan 2024 – {__LATEST_EMAIL_DATE__})</span>
            <div class='window-controls'>
              <button class='wc-btn wc-minimize' title='Minimize' aria-label='Minimize'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <line x1="1" y1="7" x2="9" y2="7" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                  <line x1="1" y1="7" x2="9" y2="7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
              <button class='wc-btn wc-maximize' title='Maximize' aria-label='Maximize'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#333333" stroke-width="2.5" />
                  <rect x="1.5" y="2.5" width="7" height="5" fill="none" stroke="#fff" stroke-width="1.5" />
                </svg>
              </button>
              <button class='wc-btn wc-close' title='Close' aria-label='Close'>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#333333" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
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
              <span class='toolbar-btn toolbar-btn--active' onClick={() => (showAddressBook.value = !showAddressBook.value)}><IconAddressBook /> Address Book</span>
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
                ? `${filteredCount.value != null ? filteredCount.value : emails.value.length} Items`
                : 'Spam Calendar'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
