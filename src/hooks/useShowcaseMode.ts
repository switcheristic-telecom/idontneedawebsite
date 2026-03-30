import { useEffect, useRef } from 'preact/hooks';
import { effect } from '@preact/signals';
import {
  emails,
  calls,
  selectedEmailId,
  selectedCallId,
  selectedContactKey,
  selectedFolder,
  showAddressBook,
  showWelcomePopup,
  sortBy,
  sortAsc,
} from '../data/store';
import { getCallId } from '../components/email-client/utils';
import { CALL_NOTE_ID } from '../components/email-client/CallTable';

const INTERVAL_EMAIL_MS = 2000;
const INTERVAL_CALL_MS = 500;
const INTERVAL_CONTACT_MS = 500;
const ABOUT_ID = '__about__';

type Step =
  | { type: 'email'; folder: 'inbox'; emailId: string }
  | { type: 'call'; folder: 'calls' | 'voicemail'; callId: string }
  | { type: 'contact'; contactKey: string };

type Mode = 'emails' | 'calls' | 'contacts' | 'all';

function buildSequence(mode: Mode): Step[] {
  const steps: Step[] = [];

  if (mode === 'emails' || mode === 'all') {
    const sorted = [...emails.value].sort((a, b) => {
      let cmp = 0;
      if (sortBy.value === 'date') cmp = a.Payload.Time - b.Payload.Time;
      else if (sortBy.value === 'from')
        cmp = a.Payload.Sender.Address.localeCompare(b.Payload.Sender.Address);
      else cmp = a.Payload.Subject.localeCompare(b.Payload.Subject);
      return sortAsc.value ? cmp : -cmp;
    });
    steps.push({ type: 'email', folder: 'inbox', emailId: ABOUT_ID });
    for (const e of sorted) steps.push({ type: 'email', folder: 'inbox', emailId: e.Payload.ID });
  }

  if (mode === 'calls' || mode === 'all') {
    steps.push({ type: 'call', folder: 'calls', callId: CALL_NOTE_ID });

    const missed = calls.value.filter((c) => c.type === 'Missed');
    for (const c of missed) steps.push({ type: 'call', folder: 'calls', callId: getCallId(c) });

    const voicemails = calls.value.filter((c) => c.type === 'Voicemail');
    for (const c of voicemails) steps.push({ type: 'call', folder: 'voicemail', callId: getCallId(c) });
  }

  if (mode === 'contacts' || mode === 'all') {
    // Build contact keys sorted by count descending (matches AddressBookWindow default)
    const map = new Map<string, number>();
    for (const e of emails.value) {
      const key = `email:${e.Payload.Sender.Address.toLowerCase()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    for (const c of calls.value) {
      const key = `phone:${c.phone}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    for (const [key] of sorted) steps.push({ type: 'contact', contactKey: key });
  }

  return steps;
}

export function useShowcaseMode() {
  if (!import.meta.env.DEV) return;
  const params = new URLSearchParams(window.location.search);
  if (!params.has('showcase')) return;
  const raw = params.get('showcase');
  const mode: Mode =
    raw === 'calls' ? 'calls'
    : raw === 'emails' ? 'emails'
    : raw === 'contacts' ? 'contacts'
    : 'all';

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);
  const stepsRef = useRef<Step[]>([]);

  useEffect(() => {
    const tick = () => {
      const steps = stepsRef.current;
      if (indexRef.current >= steps.length) {
        timerRef.current = null;
        return;
      }

      const step = steps[indexRef.current];
      if (step.type === 'email') {
        showAddressBook.value = false;
        selectedFolder.value = step.folder;
        selectedEmailId.value = step.emailId;
        selectedCallId.value = null;
      } else if (step.type === 'call') {
        showAddressBook.value = false;
        selectedFolder.value = step.folder;
        selectedCallId.value = step.callId;
        selectedEmailId.value = null;
      } else {
        showAddressBook.value = true;
        selectedContactKey.value = step.contactKey;
      }
      indexRef.current++;

      requestAnimationFrame(() => {
        const row = document.querySelector(
          step.type === 'contact'
            ? '.ab-table tr.selected'
            : '.email-table tr.selected',
        );
        row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });

      const delay = step.type === 'email' ? INTERVAL_EMAIL_MS
        : step.type === 'call' ? INTERVAL_CALL_MS
        : INTERVAL_CONTACT_MS;
      timerRef.current = setTimeout(tick, delay);
    };

    return effect(() => {
      if (showWelcomePopup.value) return;
      if (timerRef.current) return;

      stepsRef.current = buildSequence(mode);
      indexRef.current = 0;
      const firstDelay = stepsRef.current[0]?.type === 'email' ? INTERVAL_EMAIL_MS
        : stepsRef.current[0]?.type === 'call' ? INTERVAL_CALL_MS
        : INTERVAL_CONTACT_MS;
      timerRef.current = setTimeout(tick, firstDelay);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
