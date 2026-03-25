/* Small Vista-style SVG icons to replace emoji */

export function IconFolder({ color = '#f0c850' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1 3.5C1 2.67 1.67 2 2.5 2H6l1.5 1.5H13.5C14.33 3.5 15 4.17 15 5v7.5c0 .83-.67 1.5-1.5 1.5h-11C1.67 14 1 13.33 1 12.5V3.5z" fill={color} />
      <path d="M1 5.5h14v7c0 .83-.67 1.5-1.5 1.5h-11C1.67 14 1 13.33 1 12.5V5.5z" fill={color} opacity="0.85" />
      <path d="M1 5.5h14v1H1z" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

export function IconInbox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="1" y="2" width="14" height="12" rx="1.5" fill="#6b9fd4" />
      <rect x="2" y="3" width="12" height="10" rx="1" fill="#e8f0fa" />
      <path d="M1 10h4.5l1 2h3l1-2H15v3.5c0 .83-.67 1.5-1.5 1.5h-11C1.67 15 1 14.33 1 13.5V10z" fill="#6b9fd4" />
      <path d="M1 10h4.5l1 2h3l1-2H15v1h-4.5l-1 2h-3l-1-2H1z" fill="rgba(255,255,255,0.25)" />
      <path d="M5 5l3 2.5L11 5" stroke="#4a7ab5" stroke-width="1.2" fill="none" />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" fill="#f0e8b0" />
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" fill="#fff8d0" />
      <path d="M1.5 3.5L8 8.5l6.5-5" stroke="#c0a830" stroke-width="0.8" fill="none" />
      <path d="M1.5 12.5L6 8.5M15 12.5L10 8.5" stroke="#c0a830" stroke-width="0.5" fill="none" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="1" y="2" width="14" height="13" rx="1.5" fill="#fff" stroke="#6b9fd4" stroke-width="1" />
      <rect x="1" y="2" width="14" height="4" rx="1.5" fill="#4a86b8" />
      <rect x="1" y="5" width="14" height="1" fill="#2f6aab" />
      <text x="8" y="13" text-anchor="middle" font-size="7" font-weight="bold" fill="#1e3a5f">28</text>
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M3.5 1.5C4.5 1 6 2 7.5 4s2 3.5 1.5 4.5L7.5 9.5c.5 1 1.5 2.5 3 3.5l1-1.5c1-.5 2.5.5 4.5 1.5s1.5 2 .5 3-3 1.5-5 0S4 11 2.5 8.5 1 3.5 1.5 2.5s1-1.5 2-1z" fill="#4a86b8" />
    </svg>
  );
}

export function IconVoicemail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="4.5" cy="8" r="3" fill="none" stroke="#4a86b8" stroke-width="1.5" />
      <circle cx="11.5" cy="8" r="3" fill="none" stroke="#4a86b8" stroke-width="1.5" />
      <line x1="4.5" y1="11" x2="11.5" y2="11" stroke="#4a86b8" stroke-width="1.5" />
    </svg>
  );
}

export function IconJunk() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5" fill="#e44" stroke="#c00" stroke-width="0.5" />
      <path d="M4 8h8" stroke="#fff" stroke-width="2" stroke-linecap="round" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="6.5" cy="6.5" r="4" fill="none" stroke="#4a86b8" stroke-width="1.5" />
      <line x1="9.5" y1="9.5" x2="14" y2="14" stroke="#4a86b8" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M8 1L5 6v2l-2 1v1h4v5l1 1 1-1v-5h4v-1l-2-1V6L8 1z" fill="#d44" />
    </svg>
  );
}

export function IconAttach() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M8 2c1.66 0 3 1.34 3 3v6c0 2.21-1.79 4-4 4s-4-1.79-4-4V5h1.5v6c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-.83-.67-1.5-1.5-1.5S6.5 4.17 6.5 5v5.5h1.5V5c0-.28.22-.5.5-.5s.5.22.5.5v5.5c0 .83-.67 1.5-1.5 1.5S6 11.33 6 10.5V5c0-1.66 1.34-3 3-3z" fill="#666" />
    </svg>
  );
}

export function IconSendReceive() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1 5l5-4v3h6v2H6v3L1 5z" fill="#4a86b8" />
      <path d="M15 11l-5 4v-3H4V10h6V7l5 4z" fill="#6b9fd4" />
    </svg>
  );
}

export function IconNew() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="2" y="3" width="12" height="10" rx="1" fill="#f8f0b0" stroke="#c0a830" stroke-width="0.5" />
      <path d="M2 3l6 5 6-5" stroke="#c0a830" stroke-width="0.7" fill="none" />
      <circle cx="12" cy="4" r="3" fill="#4a4" />
      <path d="M12 2.5v3M10.5 4h3" stroke="#fff" stroke-width="1" stroke-linecap="round" />
    </svg>
  );
}

export function IconReply() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M6 3L1 7.5 6 12V9c4 0 7 1 9 4-1-5-4-8-9-8V3z" fill="#4a86b8" />
    </svg>
  );
}

export function IconReplyAll() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M9 3L4 7.5 9 12V9c4 0 6 1 7 4-.5-5-3-8-7-8V3z" fill="#4a86b8" />
      <path d="M5 5L1 7.5 5 10" stroke="#4a86b8" stroke-width="1.5" fill="none" />
    </svg>
  );
}

export function IconForward() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M10 3l5 4.5L10 12V9C6 9 3 10 1 13c1-5 4-8 9-8V3z" fill="#4a86b8" />
    </svg>
  );
}

export function IconDelete() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M5 1h6v2H5V1z" fill="#888" />
      <rect x="3" y="3" width="10" height="1.5" rx="0.5" fill="#888" />
      <path d="M4 5h8l-.5 10H4.5L4 5z" fill="#c0c0c0" />
      <path d="M6 6.5v7M8 6.5v7M10 6.5v7" stroke="#888" stroke-width="0.7" />
    </svg>
  );
}

export function IconAddressBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="3" y="1" width="11" height="14" rx="1" fill="#6b9fd4" />
      <rect x="4" y="2" width="9" height="12" rx="0.5" fill="#fff" />
      <circle cx="8.5" cy="6" r="2" fill="#c8d8ea" />
      <path d="M5 12c0-2 1.5-3 3.5-3s3.5 1 3.5 3" fill="#c8d8ea" />
      <rect x="1" y="4" width="3" height="1.5" rx="0.5" fill="#d44" />
      <rect x="1" y="7" width="3" height="1.5" rx="0.5" fill="#4a4" />
      <rect x="1" y="10" width="3" height="1.5" rx="0.5" fill="#44a" />
    </svg>
  );
}
