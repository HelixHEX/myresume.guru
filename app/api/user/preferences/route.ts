import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_MODEL_VALUES = ["auto", "gpt-5-mini", "gpt-5"] as const;

function isValidModelPreference(value: string): value is (typeof ALLOWED_MODEL_VALUES)[number] {
	return ALLOWED_MODEL_VALUES.includes(value as (typeof ALLOWED_MODEL_VALUES)[number]);
}

export async function GET() {
	const userId = await auth().then((a) => a.userId);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const pref = await prisma.userPreference.findUnique({
		where: { userId },
		select: { modelPreference: true },
	});

	const modelName = pref?.modelPreference ?? "auto";
	return NextResponse.json({ modelName });
}

export async function PATCH(req: Request) {
	const userId = await auth().then((a) => a.userId);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body: { modelName?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const modelName = typeof body.modelName === "string" ? body.modelName.trim() : undefined;
	if (!modelName || !isValidModelPreference(modelName)) {
		return NextResponse.json(
			{ error: "modelName must be one of: auto, gpt-5-mini, gpt-5" },
			{ status: 400 }
		);
	}

	await prisma.userPreference.upsert({
		where: { userId },
		create: { userId, modelPreference: modelName },
		update: { modelPreference: modelName },
	});

	return NextResponse.json({ modelName });
}
