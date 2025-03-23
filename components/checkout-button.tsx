"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CheckoutButton() {
	const [loading, setLoading] = useState(false);
	const handleCheckout = async () => {
		setLoading(true);
		const result = await createCheckoutSession();
		console.log(result);
		// if (!result.success) {
		// 	toast.error(result.error as string);
		// }

		setLoading(false);
	}
	return (
		<Button
			onClick={handleCheckout}
			className={cn(buttonVariants({ size: "lg" }), "bg-dark-gray")}
			disabled={loading}
		>
			{loading ? <Loader2 className="animate-spin" /> : "Get Started"}
		</Button>
	);
}
