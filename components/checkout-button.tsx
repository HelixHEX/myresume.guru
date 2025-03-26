"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function CheckoutButton() {
	const router = useRouter();
	const { openSignUp } = useClerk();
	const [loading, setLoading] = useState(false);
	const handleCheckout = async () => {
		setLoading(true);
		const result = await createCheckoutSession();
		console.log(result);
		// if (!result.success) {
		// 	toast.error(result.error as string);
		// }

		setLoading(false);
	};

	return (
		<>
			<SignedIn>
				<Button
					onClick={handleCheckout}
					className={cn(buttonVariants({ size: "lg" }), "bg-blue-800 hover:bg-blue-900")}
					disabled={loading}
				>
					{loading ? <Loader2 className="animate-spin" /> : "Upgrade Plan"}
				</Button>
			</SignedIn>
			<SignedOut>
				<Button
					onClick={() => {
						openSignUp({ forceRedirectUrl: "/plans?startCheckout=true" })
					}}
					className={cn(buttonVariants({ size: "lg" }), "bg-blue-800 hover:bg-blue-900")}
					disabled={loading}
				>
					Get Started
				</Button>
			</SignedOut>
		</>
	);
}
