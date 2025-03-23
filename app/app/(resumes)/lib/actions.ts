'use server';

import { createAI } from "ai/rsc";

export const AI = createAI({
  actions: {
    // generateFeedback,
  },
  initialAIState: [],
  initialUIState: []
});
