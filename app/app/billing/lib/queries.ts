"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UsageResponse = {
	summary: { messages: number; tokens: number; chats: number };
	byModel: Array<{ model: string; messages: number; tokens: number; percent: number }>;
};

export const usageQueryKey = (range: string) => ["user", "usage", range] as const;

export const getUsage = async (range: string): Promise<UsageResponse> => {
	const { data } = await axios.get<UsageResponse>("/api/user/usage", {
		params: { range },
		withCredentials: true,
	});
	return data;
};

export const useUsage = (range: string) => {
	return useQuery({
		queryKey: usageQueryKey(range),
		queryFn: () => getUsage(range),
	});
};
