"use client";

import { useThreadComposer, useThreadRuntime } from "@assistant-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type ChatUrlSyncProps = {
  isNewChat: boolean;
};

const MESSAGE_PARAM = "message";
const DEBOUNCE_MS = 400;

/**
 * Syncs composer draft to URL as ?message=... and, when the page loads with ?message=, sets composer text and sends.
 * Must be rendered inside AssistantRuntimeProvider (so useThreadComposer/useThreadRuntime work).
 */
export function ChatUrlSync({ isNewChat }: ChatUrlSyncProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = useThreadComposer((s) => s.text);
  const runtime = useThreadRuntime();
  const sentFromParamRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Capture message param on first render so we only send when we landed with ?message= (e.g. after redirect from new chat), not when the debounce added it while typing
  const mountedWithMessageParamRef = useRef<string | null | undefined>(undefined);
  if (mountedWithMessageParamRef.current === undefined) {
    mountedWithMessageParamRef.current = searchParams.get(MESSAGE_PARAM);
  }

  const messageParam = searchParams.get(MESSAGE_PARAM);

  // On load: if URL had ?message=... when we mounted (e.g. after redirect from new chat), set composer text and send, then remove param.
  // Skip when isNewChat. Skip when param was added by our debounce (param !== mounted value).
  useEffect(() => {
    if (isNewChat || messageParam == null || messageParam === "" || sentFromParamRef.current) return;
    if (messageParam !== mountedWithMessageParamRef.current) return;
    const decoded = decodeURIComponent(messageParam);
    runtime.composer.setText(decoded);
    runtime.composer.send();
    sentFromParamRef.current = true;
    const next = new URLSearchParams(searchParams);
    next.delete(MESSAGE_PARAM);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [isNewChat, messageParam, pathname, router, runtime, searchParams]);

  // Sync composer text to URL (debounced). Path will be /app/chat/new or /app/chat/{id}.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const next = new URLSearchParams(searchParams);
      if (text.trim()) {
        next.set(MESSAGE_PARAM, text);
      } else {
        next.delete(MESSAGE_PARAM);
      }
      const qs = next.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, router, searchParams, text]);

  return null;
}
