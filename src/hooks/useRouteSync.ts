import { useEffect, useRef } from "preact/hooks";
import { useLocation, useSearch } from "wouter-preact";
import { effect } from "@preact/signals";
import {
  activeTab,
  selectedFolder,
  searchQuery,
  callDateFilter,
  selectedEmailId,
} from "../data/store";

/**
 * Two-way sync between URL hash and app signals.
 *
 * Hash routes:
 *   #/inbox?search=from:alice        → activeTab=inbox, selectedFolder=inbox, searchQuery=from:alice
 *   #/calls?date=2024-03-15          → activeTab=inbox, selectedFolder=calls, callDateFilter=2024-03-15
 *   #/voicemail                      → activeTab=inbox, selectedFolder=voicemail
 *   #/calendar                       → activeTab=calendar
 *   #/inbox?email=<id>               → selectedEmailId=<id>
 */
export function useRouteSync() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const suppressSync = useRef(false);

  // URL → signals
  useEffect(() => {
    suppressSync.current = true;

    const path = location || "/inbox";
    const params = new URLSearchParams(search);

    if (path === "/calendar") {
      activeTab.value = "calendar";
    } else {
      activeTab.value = "inbox";

      if (path === "/calls") {
        selectedFolder.value = "calls";
        callDateFilter.value = params.get("date") || null;
        searchQuery.value = "";
      } else if (path === "/voicemail") {
        selectedFolder.value = "voicemail";
        callDateFilter.value = null;
        searchQuery.value = "";
      } else {
        // /inbox or /
        selectedFolder.value = "inbox";
        callDateFilter.value = null;
        searchQuery.value = params.get("search") || "";
      }

      const emailId = params.get("email");
      if (emailId) {
        selectedEmailId.value = emailId;
      }
    }

    // Allow signal→URL sync after a tick
    requestAnimationFrame(() => {
      suppressSync.current = false;
    });
  }, [location, search]);

  // Signals → URL
  const prevPath = useRef("");
  useEffect(() => {
    return effect(() => {
      // Read all signals to subscribe
      const tab = activeTab.value;
      const folder = selectedFolder.value;
      const query = searchQuery.value;
      const dateFilter = callDateFilter.value;

      if (suppressSync.current) return;

      let path: string;
      const params = new URLSearchParams();

      if (tab === "calendar") {
        path = "/calendar";
      } else if (folder === "calls") {
        path = "/calls";
        if (dateFilter) params.set("date", dateFilter);
      } else if (folder === "voicemail") {
        path = "/voicemail";
      } else {
        path = "/inbox";
        if (query) params.set("search", query);
      }

      const qs = params.toString();
      const full = qs ? `${path}?${qs}` : path;

      // Push a new history entry when the path changes (folder/tab navigation),
      // replace when only the query params change (typing in search).
      const replace = path === prevPath.current;
      prevPath.current = path;

      navigate(full, { replace });

      // Workaround: wouter's useHashLocation navigate sets url.search
      // when present but never clears it. Manually strip stale search params.
      if (!qs && window.location.search) {
        const url = new URL(window.location.href);
        url.search = "";
        history.replaceState(history.state, "", url.href);
      }
    });
  }, []);
}
