import { useMemo } from "preact/hooks";
import { emails, calls } from "../../data/store";

export function CalendarWindow(_props: { windowId: string; props?: Record<string, unknown> }) {
  const emailList = emails.value;
  const callList = calls.value;

  // Aggregate activity by date
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
    <div class="flex flex-col h-full bg-win-bg text-[11px] font-win overflow-auto win95-scroll p-2">
      <div class="text-center font-bold mb-2 text-sm">
        📅 Spam Activity Calendar
      </div>
      <div class="text-center text-gray-600 mb-3">
        Domain registered: January 28, 2024
      </div>

      <div class="flex gap-4 justify-center flex-wrap">
        <MonthGrid
          year={2024}
          month={0}
          activityByDate={activityByDate}
          maxActivity={maxActivity}
        />
        <MonthGrid
          year={2024}
          month={1}
          activityByDate={activityByDate}
          maxActivity={maxActivity}
        />
        <MonthGrid
          year={2024}
          month={2}
          activityByDate={activityByDate}
          maxActivity={maxActivity}
        />
      </div>

      {/* Legend */}
      <div class="flex items-center gap-4 justify-center mt-4 text-[10px]">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-blue-200 border border-gray-400" />
          <span>Low</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-blue-400 border border-gray-400" />
          <span>Medium</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-red-500 border border-gray-400" />
          <span>High</span>
        </div>
        <div class="flex items-center gap-1">
          <span>📧 = emails</span>
        </div>
        <div class="flex items-center gap-1">
          <span>📞 = calls</span>
        </div>
      </div>

      {/* Summary stats */}
      <div class="win95-inset bg-white p-2 mt-3 text-center">
        <b>Total:</b> {emailList.length} spam emails + {callList.length} calls
        received within weeks of registration
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

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div class="win95-inset bg-white p-2">
      <div class="text-center font-bold mb-1">
        {monthNames[month]} {year}
      </div>
      <div class="grid grid-cols-7 gap-[1px] text-center text-[10px]">
        {dayNames.map((d) => (
          <div key={d} class="font-bold text-gray-600 px-1 py-[1px]">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const activity = activityByDate[dateStr];
          const total = activity ? activity.emails + activity.calls : 0;
          const intensity = total / maxActivity;

          let bg = "";
          if (total > 0) {
            if (intensity > 0.6) bg = "bg-red-400 text-white";
            else if (intensity > 0.3) bg = "bg-blue-400 text-white";
            else bg = "bg-blue-200";
          }

          const title = activity
            ? `${dateStr}: ${activity.emails} email(s), ${activity.calls} call(s)`
            : dateStr;

          return (
            <div
              key={dateStr}
              class={`px-1 py-[2px] cursor-default ${bg} border border-transparent hover:border-gray-400`}
              title={title}
            >
              {day}
              {activity && (
                <div class="text-[8px] leading-none">
                  {activity.emails > 0 && `${activity.emails}📧`}
                  {activity.calls > 0 && `${activity.calls}📞`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
