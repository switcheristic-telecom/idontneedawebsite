import { signal } from "@preact/signals";
import type { EmailMetadata, CallMetadata } from "../types";

export const emails = signal<EmailMetadata[]>([]);
export const calls = signal<CallMetadata[]>([]);

export const activeTab = signal<"inbox" | "calendar">("inbox");
export const selectedFolder = signal<"inbox" | "calls" | "voicemail">("inbox");
export const selectedEmailId = signal<string | null>("__about__");
export const sortBy = signal<"date" | "from" | "subject">("date");
export const sortAsc = signal(true);
