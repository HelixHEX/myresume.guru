"use client";

import { streamingFetch } from "@/lib";
import { useEffect, useState } from "react";

export default function RenderStreamData({
  render,
}: {
  render: (data: any[]) => React.ReactNode
}) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const asyncFetch = async () => {
      const it = streamingFetch("/api/resume/generate-feedback");

      for await (let value of it) {
        try {
          const chunk = JSON.parse(value);
          console.log(chunk)
          setData((prev) => [...prev, chunk]);
        } catch (e: any) {
          console.warn(e.message);
        }
      }
    };

    asyncFetch();
  }, []);

  return <>{render(data)}</>;
}
