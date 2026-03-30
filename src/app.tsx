import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { Router } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { emails, calls, activeTab, filteredCount, showAddressBook } from './data/store';
import { loadEmails } from './data/emails';
import { loadCalls } from './data/calls';
import { useRouteSync } from './hooks/useRouteSync';
import { useShowcaseMode } from './hooks/useShowcaseMode';
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
  IconMinimize,
  IconMaximize,
  IconClose,
} from './components/VistaIcons';

export function App() {
  return (
    <Router hook={useHashLocation}>
      <AppShell />
    </Router>
  );
}

type MenuItem = { label: string; url: string } | '---';
type MenuDef = { label: string; underline: string; items?: MenuItem[] };

const CTA_ITEMS: MenuItem[] = [
  { label: 'Email NTIA about .US Privacy', url: 'mailto:dotus@ntia.gov' },
  { label: 'Contact Your Representative', url: 'https://www.house.gov/representatives/find-your-representative' },
];

const MENUS: MenuDef[] = [
  { label: 'File', underline: 'F', items: CTA_ITEMS },
  { label: 'Edit', underline: 'E', items: CTA_ITEMS },
  { label: 'View', underline: 'V', items: CTA_ITEMS },
  { label: 'Go', underline: 'G', items: CTA_ITEMS },
  { label: 'Tools', underline: 'T', items: CTA_ITEMS },
  { label: 'Actions', underline: 'A', items: CTA_ITEMS },
  { label: 'Help', underline: 'H', items: CTA_ITEMS },
];

function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openMenu, close]);

  return (
    <div class='menubar' ref={barRef}>
      {MENUS.map((menu) => (
        <span
          key={menu.label}
          class={`menubar-item${openMenu === menu.label ? ' menubar-item--open' : ''}`}
          onMouseDown={() => {
            if (openMenu === menu.label) {
              close();
            } else {
              setOpenMenu(menu.label);
            }
          }}
          onMouseEnter={() => {
            if (openMenu) {
              setOpenMenu(menu.label);
            }
          }}
        >
          <u>{menu.underline}</u>
          {menu.label.replace(menu.underline, '')}
          {openMenu === menu.label && menu.items && (
            <div class='menubar-dropdown'>
              {menu.items.map((item, i) =>
                item === '---' ? (
                  <div key={i} class='menubar-dropdown-sep' />
                ) : (
                  <a
                    key={item.label}
                    class='menubar-dropdown-item'
                    href={item.url}
                    target={item.url.startsWith('mailto:') ? undefined : '_blank'}
                    onMouseDown={(e: MouseEvent) => e.stopPropagation()}
                    onClick={close}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          )}
        </span>
      ))}
    </div>
  );
}

function AppShell() {
  useRouteSync();
  useShowcaseMode();

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
            <span class='titlebar-text'>idontneedawebsite Mail</span>
            <div class='window-controls'>
              <button class='wc-btn wc-minimize' title='Minimize' aria-label='Minimize'>
                <IconMinimize />
              </button>
              <button class='wc-btn wc-maximize' title='Maximize' aria-label='Maximize'>
                <IconMaximize />
              </button>
              <button class='wc-btn wc-close' title='Close' aria-label='Close'>
                <IconClose />
              </button>
            </div>
          </div>

          {/* Window content */}
          <div class='aero-window main-app'>
            {/* Menu bar */}
            <MenuBar />

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
