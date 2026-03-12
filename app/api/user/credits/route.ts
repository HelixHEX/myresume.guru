import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getBalance } from "@/lib/credits";

export async function GET() {
	const userId = await auth().then((a) => a.userId);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const balance = await getBalance(userId);
	return NextResponse.json({ balance });
}
