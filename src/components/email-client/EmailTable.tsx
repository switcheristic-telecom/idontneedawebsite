import { useSignal } from '@preact/signals';
import type { EmailMetadata } from '../../types';
import { getDateGroup, formatEmailDate, formatEmailSize } from './utils';
import { IconPin, IconMail } from '../VistaIcons';
import { searchQuery } from '../../data/store';
import { highlightText } from '../../utils/highlight';

export const ABOUT_ID = '__about__';

function getGroupKey(
  email: EmailMetadata,
  groupBy: 'date' | 'from' | 'subject',
): string {
  if (groupBy === 'date') return getDateGroup(email.Payload.Time);
  if (groupBy === 'from') {
    const name = email.Payload.Sender.Name || email.Payload.Sender.Address;
    const letter = name.charAt(0).toUpperCase();
    return /[A-Z]/.test(letter) ? letter : '#';
  }
  const letter = email.Payload.Subject.replace(/^(Re|Fwd|Fw):\s*/i, '')
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
}

export function EmailTable({
  emails,
  selectedId,
  onSelect,
  onSort,
  arrow,
  groupBy = 'date',
}: {
  emails: EmailMetadata[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSort: (col: 'date' | 'from' | 'subject') => void;
  arrow: (col: string) => string;
  groupBy?: 'date' | 'from' | 'subject';
}) {
  const terms = searchQuery.value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const collapsed = useSignal<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    collapsed.value = { ...collapsed.value, [label]: !collapsed.value[label] };
  };

  // Group emails by current sort column
  const groups: { label: string; emails: EmailMetadata[] }[] = [];
  let currentGroup = '';

  for (const email of emails) {
    const group = getGroupKey(email, groupBy);
    if (group !== currentGroup) {
      currentGroup = group;
      groups.push({ label: group, emails: [] });
    }
    groups[groups.length - 1].emails.push(email);
  }

  return (
    <table width='100%' cellPadding='0' cellSpacing='0' class='email-table'>
      <thead>
        <tr>
          <th class='col-header col-icon'>&nbsp;</th>
          <th class='col-header col-from' onClick={() => onSort('from')}>
            From{arrow('from')}
          </th>
          <th class='col-header' onClick={() => onSort('subject')}>
            Subject{arrow('subject')}
          </th>
          <th class='col-header col-received' onClick={() => onSort('date')}>
            Received{arrow('date')}
          </th>
          <th class='col-header col-size'>Size</th>
        </tr>
      </thead>
      <tbody>
        {/* Pinned about row */}
        <tr
          class={`about-row ${selectedId === ABOUT_ID ? 'selected' : ''}`}
          onClick={() => onSelect(ABOUT_ID)}
        >
          <td><IconPin /></td>
          <td class='cell-from'>Webb Notneeded</td>
          <td class='cell-subject'>
            <span class='card-icon'>
              <IconMail />
            </span>
            Not for .us &mdash; Read Me First
          </td>
          <td>Sun 1/28/2024 3:29 PM</td>
          <td>4 KB</td>
        </tr>

        {/* Grouped emails */}
        {groups.map((group) => {
          const isCollapsed = collapsed.value[group.label];
          return (
            <>
              <tr
                class='date-group-header'
                key={`group-${group.label}`}
                onClick={() => toggleGroup(group.label)}
              >
                <td colSpan={5}>
                  <svg
                    class='group-toggle'
                    width='11'
                    height='11'
                    viewBox='0 0 11 11'
                  >
                    <defs>
                      <linearGradient id='toggleBg' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stop-color='#f8fbff' />
                        <stop offset='100%' stop-color='#d4e4f4' />
                      </linearGradient>
                      <filter id='toggleShadow'>
                        <feDropShadow
                          dx='0'
                          dy='0.5'
                          stdDeviation='0.4'
                          flood-color='#000'
                          flood-opacity='0.15'
                        />
                      </filter>
                    </defs>
                    <rect
                      x='0.5'
                      y='0.5'
                      width='10'
                      height='10'
                      rx='1.5'
                      fill='url(#toggleBg)'
                      stroke='#7a9ab5'
                      stroke-width='0.8'
                      filter='url(#toggleShadow)'
                    />
                    {isCollapsed && (
                      <rect
                        x='4.5'
                        y='2.5'
                        width='1.5'
                        height='6'
                        rx='0.3'
                        fill='#2b5278'
                      />
                    )}
                    <rect
                      x='2.5'
                      y='4.5'
                      width='6'
                      height='1.5'
                      rx='0.3'
                      fill='#2b5278'
                    />
                  </svg>
                  {group.label}
                </td>
              </tr>
              {!isCollapsed &&
                group.emails.map((email) => (
                  <tr
                    key={email.Payload.ID}
                    class={`email-row ${selectedId === email.Payload.ID ? 'selected' : ''}`}
                    onClick={() => onSelect(email.Payload.ID)}
                  >
                    <td><IconMail /></td>
                    <td class='cell-from'>
                      {highlightText(
                        email.Payload.Sender.Name ||
                          email.Payload.Sender.Address,
                        terms,
                      )}
                    </td>
                    <td class='cell-subject'>
                      <span class='card-icon'>
                        <IconMail />
                      </span>
                      {highlightText(email.Payload.Subject, terms)}
                    </td>
                    <td>{formatEmailDate(email.Payload.Time)}</td>
                    <td>{formatEmailSize(email.Payload.Size)}</td>
                  </tr>
                ))}
            </>
          );
        })}
      </tbody>
    </table>
  );
}
