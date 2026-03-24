import { useEffect } from "preact/hooks";
import { Desktop } from "./components/desktop/Desktop";
import { Taskbar } from "./components/desktop/Taskbar";
import { WindowManager } from "./components/window/WindowManager";
import { emails, calls, openWindow } from "./data/store";
import { loadEmails } from "./data/emails";
import { loadCalls } from "./data/calls";

export function App() {
  useEffect(() => {
    loadEmails().then((data) => {
      emails.value = data;
    });
    loadCalls().catch(() => {
      // call-metadata.json may not exist yet
      calls.value = [];
    });

    // Auto-open the inbox on load
    openWindow("email-client", "Inbox - idontneedawebsite Mail");
  }, []);

  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return <MobileView />;
  }

  return (
    <div class="w-full h-full relative">
      <Desktop />
      <WindowManager />
      <Taskbar />
    </div>
  );
}

function MobileView() {
  return (
    <div class="bg-win-desktop min-h-screen text-white font-win p-4">
      <div class="win95-outset bg-win-bg text-black p-4 max-w-md mx-auto mt-8">
        <div class="win95-titlebar mb-2">
          <span class="flex-1 text-center font-bold">⚠️ Resolution Warning</span>
        </div>
        <div class="p-3 text-[12px] leading-relaxed">
          <p class="mb-2 text-center font-bold">
            This page is best viewed at 800×600 resolution
            <br />
            with Internet Explorer 5.0 or higher
          </p>
          <hr class="my-3" />
          <p class="mb-2">
            <b>idontneedawebsite.us</b> is a case study documenting the spam
            received after registering a .US domain — where WHOIS privacy
            redaction is not available.
          </p>
          <p class="mb-2">
            The full experience is a retro email client interface best
            viewed on a desktop computer.
          </p>
          <p class="text-center text-gray-500 mt-4">
            A Switcheristic Telecommunications project
            <br />
            &copy; 2024 Webb Notneeded
          </p>
        </div>
      </div>
    </div>
  );
}
