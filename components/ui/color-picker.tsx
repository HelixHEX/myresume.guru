"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useForwardedRef } from "@/lib/hooks";
import type { ButtonProps } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Paintbrush } from "lucide-react";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
}

const ColorPicker = forwardRef<
	HTMLInputElement,
	Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
	(
		{ disabled, value, onChange, onBlur, name, className, ...props },
		forwardedRef,
	) => {
		const ref = useForwardedRef(forwardedRef);
		const [open, setOpen] = useState(false);

		const parsedValue = useMemo(() => {
			return value || "#FFFFFF";
		}, [value]);

		return (
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
					<Button
						{...props}
						className={cn("block", className)}
						name={name}
						onClick={() => {
							setOpen(true);
						}}
						size="icon"
						style={{
							backgroundColor: parsedValue,
						}}
						variant="outline"
					>
						<div />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full">
					<HexColorPicker color={parsedValue} onChange={onChange} />
					<Input
						maxLength={7}
						onChange={(e) => {
							onChange(e?.currentTarget?.value);
						}}
						ref={ref}
						value={parsedValue}
					/>
				</PopoverContent>
			</Popover>
		);
	},
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };

export function GradientPicker({
	background,
	setBackground,
	className,
}: {
	background: string;
	setBackground: (background: string) => void;
	className?: string;
}) {
	const solids = [
		"#E2E2E2",
		"#ff75c3",
		"#ffa647",
		"#ffe83f",
		"#9fff5b",
		"#70e2ff",
		"#cd93ff",
		"#09203f",
	];

	const gradients = [
		"linear-gradient(to top left,#accbee,#e7f0fd)",
		"linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
		"linear-gradient(to top left,#000000,#434343)",
		"linear-gradient(to top left,#09203f,#537895)",
		"linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)",
		"linear-gradient(to top left,#f953c6,#b91d73)",
		"linear-gradient(to top left,#ee0979,#ff6a00)",
		"linear-gradient(to top left,#F00000,#DC281E)",
		"linear-gradient(to top left,#00c6ff,#0072ff)",
		"linear-gradient(to top left,#4facfe,#00f2fe)",
		"linear-gradient(to top left,#0ba360,#3cba92)",
		"linear-gradient(to top left,#FDFC47,#24FE41)",
		"linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)",
		"linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
		"linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
		"linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
	];

	const images = [
		"url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
		"url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
		"url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
		"url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
	];

	const defaultTab = useMemo(() => {
		if (background.includes("url")) return "image";
		if (background.includes("gradient")) return "gradient";
		return "solid";
	}, [background]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[220px] justify-start text-left font-normal",
						!background && "text-muted-foreground",
						className,
					)}
				>
					<div className="w-full flex items-center gap-2">
						{background ? (
							<div
								className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
								style={{ background }}
							></div>
						) : (
							<Paintbrush className="h-4 w-4" />
						)}
						<div className="truncate flex-1">
							{background ? background : "Pick a color"}
						</div>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64">
				{/* <TabsList className="w-full mb-4">
						<TabsTrigger className="flex-1" value="solid">
							Solid
						</TabsTrigger>
					</TabsList> */}

				<div>
					{solids.map((s) => (
						<div
							key={s}
							style={{ background: s }}
							className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
							onClick={() => setBackground(s)}
						/>
					))}
				</div>

				<Input
					id="custom"
					value={background}
					className="col-span-2 h-8 mt-4"
					onChange={(e) => setBackground(e.currentTarget.value)}
				/>
			</PopoverContent>
		</Popover>
	);
}

const GradientButton = ({
	background,
	children,
}: {
	background: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
			style={{ background }}
		>
			<div className="bg-popover/80 rounded-md p-1 text-xs text-center">
				{children}
			</div>
		</div>
	);
};
