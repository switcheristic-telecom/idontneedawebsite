import { useMemo } from "preact/hooks";
import { emails, calls } from "../../data/store";

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

  return (
    <div class="calendar-container">
      <div class="calendar-header">
        <span class="calendar-title">
          &#128197; Spam Activity Calendar
        </span>
        <br />
        <span class="calendar-subtitle">
          Domain registered: January 28, 2024
        </span>
      </div>

      <div class="calendar-grid-row">
        <MonthGrid year={2024} month={0} activityByDate={activityByDate} maxActivity={maxActivity} />
        <MonthGrid year={2024} month={1} activityByDate={activityByDate} maxActivity={maxActivity} />
        <MonthGrid year={2024} month={2} activityByDate={activityByDate} maxActivity={maxActivity} />
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#cce0ff" }} />
          Low
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#6699ff" }} />
          Medium
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style={{ background: "#ff4444" }} />
          High
        </span>
        <span style={{ marginRight: "8px" }}>&#9993; = emails</span>
        <span>&#9742; = calls</span>
      </div>

      <div style={{ textAlign: "center" }}>
        <div class="panel-inset calendar-totals">
          <b>Total:</b> {emailList.length} spam emails + {callList.length} calls received within weeks of registration
        </div>
      </div>
    </div>
  );
}

function MonthGrid({
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
    <table
      class="panel-inset"
      cellPadding="0"
      cellSpacing="1"
      style={{ borderRadius: "2px" }}
    >
      <tr>
        <td colSpan={7} align="center" class="month-header">
          {monthNames[month]} {year}
        </td>
      </tr>
      <tr>
        {dayNames.map((d) => (
          <td key={d} align="center" class="cal-day-name">
            {d}
          </td>
        ))}
      </tr>
      {rows.map((week, wi) => (
        <tr key={wi}>
          {week.map((day, di) => {
            if (day === null)
              return <td key={`e${di}`} class="cal-day" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const activity = activityByDate[dateStr];
            const total = activity ? activity.emails + activity.calls : 0;
            const intensity = total / maxActivity;

            let bg = "#fff";
            if (total > 0) {
              if (intensity > 0.6) bg = "#ff4444";
              else if (intensity > 0.3) bg = "#6699ff";
              else bg = "#cce0ff";
            }

            const fontColor = intensity > 0.3 ? "#fff" : "#000";

            return (
              <td
                key={dateStr}
                class="cal-day"
                style={{ background: bg, color: fontColor }}
                title={
                  activity
                    ? `${dateStr}: ${activity.emails} email(s), ${activity.calls} call(s)`
                    : dateStr
                }
              >
                <span class="cal-day-num">{day}</span>
                {activity && (
                  <>
                    <br />
                    <span class="cal-activity" style={{ color: fontColor }}>
                      {activity.emails > 0 && `${activity.emails}\u2709`}
                      {activity.calls > 0 && `${activity.calls}\u260E`}
                    </span>
                  </>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </table>
  );
}
