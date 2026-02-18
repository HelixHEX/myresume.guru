"use client";

import { useEffect } from "react";

const RECENT_IDS_KEY = "resumes-recent-ids";
const RECENT_MAX = 5;

export default function RecordRecentResume({ fileKey }: { fileKey: string }) {
  useEffect(() => {
    const id = fileKey.trim();
    if (!id) return;

    try {
      const raw = localStorage.getItem(RECENT_IDS_KEY);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      const next = [
        id,
        ...prev.filter((x) => x !== id),
      ].slice(0, RECENT_MAX);
      localStorage.setItem(RECENT_IDS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [fileKey]);

  return null;
}
