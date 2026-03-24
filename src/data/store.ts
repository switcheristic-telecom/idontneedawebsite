import { signal, computed } from "@preact/signals";
import type { WindowState, EmailMetadata, CallMetadata } from "../types";

// Data
export const emails = signal<EmailMetadata[]>([]);
export const calls = signal<CallMetadata[]>([]);

// Window management
export const windows = signal<WindowState[]>([]);
let nextZIndex = 1;

export const activeWindowId = computed(() => {
  const visible = windows.value.filter((w) => !w.minimized);
  if (visible.length === 0) return null;
  return visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id;
});

export function openWindow(
  component: WindowState["component"],
  title: string,
  opts?: Partial<WindowState>
) {
  // If window with same component already exists (except email-popup), focus it
  if (component !== "email-popup") {
    const existing = windows.value.find((w) => w.component === component);
    if (existing) {
      focusWindow(existing.id);
      if (existing.minimized) {
        windows.value = windows.value.map((w) =>
          w.id === existing.id ? { ...w, minimized: false } : w
        );
      }
      return existing.id;
    }
  }

  const id = `${component}-${Date.now()}`;
  const icons: Record<string, string> = {
    "email-client": "📧",
    calendar: "📅",
    about: "ℹ️",
    "email-popup": "✉️",
  };

  const defaults: Record<string, Partial<WindowState>> = {
    "email-client": { x: 40, y: 20, width: 860, height: 520 },
    calendar: { x: 100, y: 60, width: 640, height: 440 },
    about: { x: 160, y: 40, width: 500, height: 460 },
    "email-popup": { x: 120 + Math.random() * 80, y: 50 + Math.random() * 60, width: 640, height: 480 },
  };

  const win: WindowState = {
    id,
    title,
    icon: icons[component] ?? "📄",
    component,
    x: 80,
    y: 40,
    width: 600,
    height: 400,
    zIndex: nextZIndex++,
    minimized: false,
    maximized: false,
    ...defaults[component],
    ...opts,
  };

  windows.value = [...windows.value, win];
  return id;
}

export function closeWindow(id: string) {
  windows.value = windows.value.filter((w) => w.id !== id);
}

export function focusWindow(id: string) {
  windows.value = windows.value.map((w) =>
    w.id === id ? { ...w, zIndex: nextZIndex++, minimized: false } : w
  );
}

export function minimizeWindow(id: string) {
  windows.value = windows.value.map((w) =>
    w.id === id ? { ...w, minimized: true } : w
  );
}

export function maximizeWindow(id: string) {
  windows.value = windows.value.map((w) => {
    if (w.id !== id) return w;
    if (w.maximized) {
      // Restore
      return {
        ...w,
        maximized: false,
        x: (w.props?._restoreX as number) ?? 80,
        y: (w.props?._restoreY as number) ?? 40,
        width: (w.props?._restoreW as number) ?? 600,
        height: (w.props?._restoreH as number) ?? 400,
      };
    }
    // Maximize
    return {
      ...w,
      maximized: true,
      props: {
        ...w.props,
        _restoreX: w.x,
        _restoreY: w.y,
        _restoreW: w.width,
        _restoreH: w.height,
      },
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight - 30, // taskbar height
    };
  });
}

export function updateWindowPosition(
  id: string,
  x: number,
  y: number
) {
  windows.value = windows.value.map((w) =>
    w.id === id ? { ...w, x, y } : w
  );
}

export function updateWindowSize(
  id: string,
  width: number,
  height: number
) {
  windows.value = windows.value.map((w) =>
    w.id === id ? { ...w, width, height } : w
  );
}

// Selected email/folder state
export const selectedFolder = signal<"inbox" | "calls" | "voicemail">("inbox");
export const selectedEmailId = signal<string | null>(null);
