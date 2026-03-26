import { signal } from "@preact/signals";
import type { EmailMetadata, CallMetadata } from "../types";

export const emails = signal<EmailMetadata[]>([]);
export const calls = signal<CallMetadata[]>([]);

export const activeTab = signal<"inbox" | "calendar">("inbox");
export const selectedFolder = signal<"inbox" | "calls" | "voicemail">("inbox");
export const selectedEmailId = signal<string | null>("__about__");
export const selectedCallId = signal<string | null>(null);
export const sortBy = signal<"date" | "from" | "subject">("date");
export const sortAsc = signal(true);
export const searchQuery = signal("");
export const searchIndex = signal<Record<string, string> | null>(null);
export const filteredCount = signal<number | null>(null);

let indexLoading = false;
export async function loadSearchIndex() {
  if (searchIndex.value || indexLoading) return;
  indexLoading = true;
  const res = await fetch("/email-search-index.json");
  searchIndex.value = await res.json();
}
