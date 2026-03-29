import { useMemo } from "preact/hooks";
import { emails, calls } from "../../data/store";
import { IconCalendar } from "../VistaIcons";

export function CalendarWindow() {
  const emailList = emails.value;
  const callList = calls.value;

  const activityByDate = useMemo(() => {
    const map: Record<string, { emails: number; calls: number }> = {};
    for (const email of emailList) {
      const d = new Date(email.Payload.Time * 1000).toISOString().split("T")[0];
      if (!map[d]) map[d] = { emails: 0, calls: 0 };
      map[d].emails++;
    }
    for (const call of callList) {
      const d = new Date(call.time).toISOString().split("T")[0];
      if (!map[d]) map[d] = { emails: 0, calls: 0 };
      map[d].calls++;
    }
    return map;
  }, [emailList, callList]);

  const maxActivity = Math.max(
    1,
    ...Object.values(activityByDate).map((v) => v.emails + v.calls)
  );

  const monthRange = useMemo(() => {
    const start = { year: 2024, month: 0 }; // Jan 2024 (registration month)

    let latestTime = 0;
    for (const email of emailList) {
      if (email.Payload.Time > latestTime) latestTime = email.Payload.Time;
    }
    for (const call of callList) {
      const t = new Date(call.time).getTime() / 1000;
      if (t > latestTime) latestTime = t;
    }

    const latestDate = latestTime > 0 ? new Date(latestTime * 1000) : new Date(2024, 2, 1);
    const end = { year: latestDate.getFullYear(), month: latestDate.getMonth() };

    const months: { year: number; month: number }[] = [];
    let y = start.year, m = start.month;
    while (y < end.year || (y === end.year && m <= end.month)) {
      months.push({ year: y, month: m });
      m++;
      if (m > 11) { m = 0; y++; }
    }
    return months;
  }, [emailList, callList]);

  return (
    <div class="calendar-container">
      <div class="calendar-header">
        <span class="calendar-title">
          <IconCalendar /> Spam Activity Calendar
        </span>
        <br />
        <span class="calendar-subtitle">
          Domain registered: January 28, 2024
        </span>
      </div>

      <div class="calendar-legend-bar">
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#dce8f5" }} />
          Low
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#a8c8e8" }} />
          Med
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#6699cc" }} />
          High
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#3366aa" }} />
          V.High
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#cc3333" }} />
          Peak
        </span>
        <span class="legend-item">
          <span
            class="legend-swatch"
            style={{
              background: "linear-gradient(180deg, #ebf8ff, #caecff)",
              border: "1px solid #5586a3",
            }}
          />
          Registered
        </span>
      </div>

      <div class="calendar-months-grid">
        {monthRange.map(({ year, month }) => (
          <MiniMonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            activityByDate={activityByDate}
            maxActivity={maxActivity}
          />
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <div class="panel-inset calendar-totals">
          <b>Total:</b> {emailList.length} spam emails + {callList.length} calls
          received within weeks of registration
        </div>
      </div>
    </div>
  );
}

function MiniMonthGrid({
  year,
  month,
  activityByDate,
  maxActivity,
}: {
  year: number;
  month: number;
  activityByDate: Record<string, { emails: number; calls: number }>;
  maxActivity: number;
}) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rows: (number | null)[][] = [];
  let row: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) row.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(d);
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    rows.push(row);
  }

  return (
    <table class="mini-month" cellPadding="0" cellSpacing="0">
      <tr>
        <td colSpan={7} align="center" class="mini-month-header">
          {monthNames[month]} {year}
        </td>
      </tr>
      <tr>
        {dayNames.map((d, i) => (
          <td key={i} align="center" class="mini-cal-day-name">
            {d}
          </td>
        ))}
      </tr>
      {rows.map((week, wi) => (
        <tr key={wi}>
          {week.map((day, di) => {
            if (day === null)
              return <td key={`e${di}`} class="mini-cal-day" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const activity = activityByDate[dateStr];
            const total = activity ? activity.emails + activity.calls : 0;
            const intensity = total / maxActivity;

            let bg: string | undefined;
            let fontColor = "#333";
            if (total > 0) {
              if (intensity > 0.8) { bg = "#cc3333"; fontColor = "#fff"; }
              else if (intensity > 0.6) { bg = "#3366aa"; fontColor = "#fff"; }
              else if (intensity > 0.4) { bg = "#6699cc"; fontColor = "#fff"; }
              else if (intensity > 0.2) { bg = "#a8c8e8"; fontColor = "#1a3a5c"; }
              else { bg = "#dce8f5"; fontColor = "#333"; }
            }

            const isRegistration = dateStr === "2024-01-28";

            return (
              <td
                key={dateStr}
                class={`mini-cal-day${total > 0 ? " has-activity" : ""}${isRegistration ? " cal-day-registration" : ""}`}
                style={{ background: bg, color: fontColor }}
                title={
                  activity
                    ? `${dateStr}${isRegistration ? " (Registration Day)" : ""}: ${activity.emails} email(s), ${activity.calls} call(s)`
                    : isRegistration
                      ? `${dateStr} (Registration Day)`
                      : dateStr
                }
              >
                {day}
              </td>
            );
          })}
        </tr>
      ))}
    </table>
  );
}
