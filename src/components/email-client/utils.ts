export function getDateGroup(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const emailDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - emailDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Date: Today";
  if (diffDays === 1) return "Date: Yesterday";
  if (diffDays <= 7) return "Date: Last Week";
  if (diffDays <= 14) return "Date: Two Weeks Ago";
  return "Date: Older";
}

export function formatEmailDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const emailDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getDay()];
  const month = date.getMonth() + 1;
  const d = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const mins = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  if (today.getTime() === emailDay.getTime()) {
    return `${h12}:${mins} ${ampm}`;
  }
  return `${day} ${month}/${d}/${year} ${h12}:${mins} ${ampm}`;
}

export function formatEmailSize(size: number): string {
  if (size < 1024) return `${size} B`;
  return `${Math.round(size / 1024)} KB`;
}
