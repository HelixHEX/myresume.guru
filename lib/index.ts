import { useEffect, useState } from "react";

export async function* streamingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    if (reader === undefined) {
      return;
    }
    const { done, value } = await reader?.read();

    if (done) break;

    try {
      yield decoder.decode(value);
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}