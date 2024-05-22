import { NextResponse } from "next/server";
export default function GET() {
  setTimeout(() => {
    return NextResponse.redirect("/app");
  }, 5000);
}
