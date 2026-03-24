import { windows } from "../../data/store";
import { Window } from "./Window";
import { EmailClient } from "../email-client/EmailClient";
import { CalendarWindow } from "../calendar/CalendarWindow";
import { AboutWindow } from "../about/AboutWindow";
import { EmailPopup } from "../email-client/EmailPopup";

const COMPONENTS: Record<string, preact.FunctionComponent<{ windowId: string; props?: Record<string, unknown> }>> = {
  "email-client": EmailClient,
  calendar: CalendarWindow,
  about: AboutWindow,
  "email-popup": EmailPopup,
};

export function WindowManager() {
  return (
    <>
      {windows.value.map((win) => {
        const Comp = COMPONENTS[win.component];
        if (!Comp) return null;
        return (
          <Window key={win.id} win={win}>
            <Comp windowId={win.id} props={win.props} />
          </Window>
        );
      })}
    </>
  );
}
