"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

export default function CheckoutButton() {
	const [loading, setLoading] = useState(false);
	return (
		<Button
			onClick={() => {
				setLoading(true);
				createCheckoutSession();
			}}
			className={cn(buttonVariants({ size: "lg" }), "bg-dark-gray")}
			disabled={loading}
		>
			{loading ? <Loader2 className="animate-spin" /> : "Get Started"}
		</Button>
	);
}
