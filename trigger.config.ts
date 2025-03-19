import { defineConfig } from "@trigger.dev/sdk/v3";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

export default defineConfig({
  project: "proj_dcvnbcwpxxfckmzqnrhr",
  runtime: "node",
  logLevel: "log",
  instrumentations: [new PrismaInstrumentation(), new OpenAIInstrumentation()],
  build: {
    extensions: [
      prismaExtension({
        version: "5.20.0", // optional, we'll automatically detect the version if not provided
        // update this to the path of your Prisma schema file
        schema: "prisma/schema.prisma",
      }),
    ],
  },
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["app/_trigger"],
});
