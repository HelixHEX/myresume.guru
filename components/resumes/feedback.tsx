"use client";

import { generateFeedback } from "@/actions";
import { useEffect, useState } from "react";

export default function Feedback({ slug }: { slug: string }) {
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const asyncFetch = async () => {
      const feedbacks = await generateFeedback(slug);
      console.log(feedbacks)
      setFeedback(feedbacks);
    };

    asyncFetch();
  }, [slug]);
  return <>{feedback}</>;
}
