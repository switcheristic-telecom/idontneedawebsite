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
    <div style={{ padding: "12px", overflow: "auto", height: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#1e3a5f" }}>
          &#128197; Spam Activity Calendar
        </span>
        <br />
        <span style={{ color: "#888", fontSize: "11px" }}>
          Domain registered: January 28, 2024
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
        <MonthGrid year={2024} month={0} activityByDate={activityByDate} maxActivity={maxActivity} />
        <MonthGrid year={2024} month={1} activityByDate={activityByDate} maxActivity={maxActivity} />
        <MonthGrid year={2024} month={2} activityByDate={activityByDate} maxActivity={maxActivity} />
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "12px" }}>
          <span style={{ width: "12px", height: "12px", background: "#cce0ff", border: "1px solid #8db2e3", display: "inline-block", borderRadius: "2px" }} />
          Low
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "12px" }}>
          <span style={{ width: "12px", height: "12px", background: "#6699ff", border: "1px solid #8db2e3", display: "inline-block", borderRadius: "2px" }} />
          Medium
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "12px" }}>
          <span style={{ width: "12px", height: "12px", background: "#ff4444", border: "1px solid #8db2e3", display: "inline-block", borderRadius: "2px" }} />
          High
        </span>
        <span style={{ marginRight: "8px" }}>&#9993; = emails</span>
        <span>&#9742; = calls</span>
      </div>

      <div style={{ textAlign: "center" }}>
        <div class="panel-inset" style={{ display: "inline-block", padding: "8px 16px", borderRadius: "2px" }}>
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
        <td
          colSpan={7}
          align="center"
          style={{
            fontWeight: "bold",
            padding: "4px",
            background: "linear-gradient(180deg, #4a86b8, #2f6aab)",
            color: "#fff",
            fontSize: "11px",
          }}
        >
          {monthNames[month]} {year}
        </td>
      </tr>
      <tr>
        {dayNames.map((d) => (
          <td
            key={d}
            align="center"
            style={{
              fontWeight: "bold",
              color: "#666",
              padding: "2px 4px",
              fontSize: "10px",
            }}
          >
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
                style={{ background: bg, color: fontColor, width: "48px", height: "36px" }}
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
