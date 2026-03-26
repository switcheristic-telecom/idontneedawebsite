import type { VNode } from "preact";

/**
 * Split text by search terms and wrap matches in <mark> elements.
 * Returns plain string when terms is empty (zero-cost path).
 */
export function highlightText(
  text: string,
  terms: string[],
): string | VNode {
  if (!terms.length || !text) return text;

  // Build a single regex that matches any term, longest first to avoid partial overlaps
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(re);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        re.test(part) ? <mark key={i}>{part}</mark> : part,
      )}
    </>
  );
}

/**
 * Highlight search terms inside an iframe's document using TreeWalker.
 * Call this after the iframe loads and whenever the search query changes.
 */
export function highlightIframe(
  doc: Document,
  terms: string[],
): void {
  // Clear previous highlights
  const marks = doc.querySelectorAll("mark[data-search-hl]");
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(doc.createTextNode(mark.textContent || ""), mark);
      parent.normalize();
    }
  });

  if (!terms.length) return;

  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const tag = node.parentElement?.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") {
        return NodeFilter.FILTER_REJECT;
      }
      return re.test(node.textContent || "")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    const frag = doc.createDocumentFragment();
    let lastIndex = 0;

    // Reset regex state
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));
      }
      const mark = doc.createElement("mark");
      mark.setAttribute("data-search-hl", "");
      mark.style.background = "#fff176";
      mark.style.color = "inherit";
      mark.textContent = match[0];
      frag.appendChild(mark);
      lastIndex = re.lastIndex;
    }
    if (lastIndex < text.length) {
      frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }
}
