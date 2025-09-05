import { tasks } from "@trigger.dev/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  await tasks.trigger('get-jobs', {})
  return NextResponse.json({ message: "Hello, world!" });
}