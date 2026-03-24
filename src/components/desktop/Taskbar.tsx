import { windows, focusWindow, minimizeWindow, activeWindowId, openWindow } from "../../data/store";

export function Taskbar() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div class="win95-taskbar fixed bottom-0 left-0 right-0 z-[9999]">
      {/* Start button */}
      <button
        class="win95-btn flex items-center gap-1 font-bold px-2"
        onClick={() => openWindow("about", "About This Project")}
      >
        <span class="text-sm">🪟</span>
        <span>Start</span>
      </button>

      {/* Separator */}
      <div class="win95-toolbar-sep h-[22px]" />

      {/* Window tabs */}
      <div class="flex-1 flex gap-1 overflow-hidden">
        {windows.value.map((win) => (
          <button
            key={win.id}
            class={`win95-task-btn ${activeWindowId.value === win.id && !win.minimized ? "active" : ""}`}
            onClick={() => {
              if (activeWindowId.value === win.id && !win.minimized) {
                minimizeWindow(win.id);
              } else {
                focusWindow(win.id);
              }
            }}
          >
            <span class="text-xs">{win.icon}</span>
            <span class="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div class="win95-inset px-2 h-[20px] flex items-center text-[11px] shrink-0">
        {timeStr}
      </div>
    </div>
  );
}
