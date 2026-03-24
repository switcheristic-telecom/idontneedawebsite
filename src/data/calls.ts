import type { CallMetadata } from "../types";

export async function loadCalls(): Promise<CallMetadata[]> {
  const res = await fetch("/call-metadata.json");
  const data: CallMetadata[] = await res.json();
  return data.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}
