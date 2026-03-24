import { DesktopIcon } from "./DesktopIcon";
import { openWindow } from "../../data/store";

export function Desktop() {
  return (
    <div class="absolute inset-0 bottom-[30px] bg-win-desktop p-2 flex flex-col gap-1 items-start content-start">
      <DesktopIcon
        icon="📧"
        label="Inbox"
        onOpen={() => openWindow("email-client", "Inbox - idontneedawebsite Mail")}
      />
      <DesktopIcon
        icon="📅"
        label="Calendar"
        onOpen={() => openWindow("calendar", "Spam Calendar")}
      />
      <DesktopIcon
        icon="ℹ️"
        label="About"
        onOpen={() => openWindow("about", "About This Project")}
      />
    </div>
  );
}
