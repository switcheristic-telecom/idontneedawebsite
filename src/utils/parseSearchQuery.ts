export interface ParsedQuery {
  from: string[];
  to: string[];
  date: string[];
  terms: string[];
}

const TOKEN_RE = /(?:(from|to|date):(\S+))|(\S+)/gi;

export function parseSearchQuery(raw: string): ParsedQuery {
  const result: ParsedQuery = { from: [], to: [], date: [], terms: [] };
  const input = raw.trim();
  if (!input) return result;

  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(input)) !== null) {
    if (match[1] && match[2]) {
      const op = match[1].toLowerCase() as "from" | "to" | "date";
      result[op].push(match[2].toLowerCase());
    } else if (match[3]) {
      result.terms.push(match[3].toLowerCase());
    }
  }

  return result;
}
