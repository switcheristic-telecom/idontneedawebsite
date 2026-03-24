import { useRef, useCallback } from "preact/hooks";
import type { WindowState } from "../../types";
import {
  closeWindow,
  focusWindow,
  minimizeWindow,
  maximizeWindow,
  updateWindowPosition,
  updateWindowSize,
  activeWindowId,
} from "../../data/store";

interface Props {
  win: WindowState;
  children: preact.ComponentChildren;
}

export function Window({ win, children }: Props) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
    winW: number;
    winH: number;
    edge: string;
  } | null>(null);

  const isActive = activeWindowId.value === win.id;

  const onTitlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (win.maximized) return;
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
      };
      focusWindow(win.id);
    },
    [win.id, win.x, win.y, win.maximized]
  );

  const onTitlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      updateWindowPosition(
        win.id,
        dragRef.current.winX + dx,
        dragRef.current.winY + dy
      );
    },
    [win.id]
  );

  const onTitlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onResizePointerDown = useCallback(
    (edge: string) => (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
        winW: win.width,
        winH: win.height,
        edge,
      };
      focusWindow(win.id);
    },
    [win.id, win.x, win.y, win.width, win.height]
  );

  const onResizePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!resizeRef.current) return;
      const r = resizeRef.current;
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;
      let { winX: x, winY: y, winW: w, winH: h } = r;

      if (r.edge.includes("e")) w = Math.max(200, r.winW + dx);
      if (r.edge.includes("s")) h = Math.max(100, r.winH + dy);
      if (r.edge.includes("w")) {
        const newW = Math.max(200, r.winW - dx);
        x = r.winX + (r.winW - newW);
        w = newW;
      }
      if (r.edge.includes("n")) {
        const newH = Math.max(100, r.winH - dy);
        y = r.winY + (r.winH - newH);
        h = newH;
      }

      updateWindowPosition(win.id, x, y);
      updateWindowSize(win.id, w, h);
    },
    [win.id]
  );

  const onResizePointerUp = useCallback(() => {
    resizeRef.current = null;
  }, []);

  if (win.minimized) return null;

  const edges = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  const edgeCursors: Record<string, string> = {
    n: "n-resize",
    s: "s-resize",
    e: "e-resize",
    w: "w-resize",
    ne: "ne-resize",
    nw: "nw-resize",
    se: "se-resize",
    sw: "sw-resize",
  };
  const edgeStyles: Record<string, preact.JSX.CSSProperties> = {
    n: { top: -3, left: 4, right: 4, height: 6 },
    s: { bottom: -3, left: 4, right: 4, height: 6 },
    e: { right: -3, top: 4, bottom: 4, width: 6 },
    w: { left: -3, top: 4, bottom: 4, width: 6 },
    ne: { top: -3, right: -3, width: 10, height: 10 },
    nw: { top: -3, left: -3, width: 10, height: 10 },
    se: { bottom: -3, right: -3, width: 10, height: 10 },
    sw: { bottom: -3, left: -3, width: 10, height: 10 },
  };

  return (
    <div
      class="absolute flex flex-col"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* Window frame */}
      <div class="win95-outset flex flex-col h-full bg-win-bg p-[2px]">
        {/* Title bar */}
        <div
          class={`${isActive ? "win95-titlebar" : "win95-titlebar win95-titlebar-inactive"} shrink-0 select-none`}
          onPointerDown={onTitlePointerDown}
          onPointerMove={onTitlePointerMove}
          onPointerUp={onTitlePointerUp}
          onDblClick={() => maximizeWindow(win.id)}
        >
          <span class="mr-1 text-xs">{win.icon}</span>
          <span class="flex-1 truncate text-win-title">{win.title}</span>
          <button
            class="win95-titlebar-btn"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
          >
            <span style={{ fontSize: "8px", marginTop: "4px" }}>_</span>
          </button>
          <button
            class="win95-titlebar-btn"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
          >
            <span style={{ fontSize: "8px" }}>{win.maximized ? "❐" : "□"}</span>
          </button>
          <button
            class="win95-titlebar-btn"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: "bold" }}>✕</span>
          </button>
        </div>

        {/* Content */}
        <div class="flex-1 overflow-hidden flex flex-col">{children}</div>
      </div>

      {/* Resize handles */}
      {!win.maximized &&
        edges.map((edge) => (
          <div
            key={edge}
            style={{
              position: "absolute",
              cursor: edgeCursors[edge],
              ...edgeStyles[edge],
              zIndex: 1,
            }}
            onPointerDown={onResizePointerDown(edge)}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
          />
        ))}
    </div>
  );
}
