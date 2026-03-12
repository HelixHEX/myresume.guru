/**
 * Model router for chat: gpt-5-mini (regular/Fast), gpt-5 (Smart/complex).
 * Auto mode defaults to gpt-5-mini and upgrades to gpt-5 for long or rewrite-style messages.
 */

export const CHAT_MODEL_IDS = ["gpt-5-mini", "gpt-5"] as const;

export type ChatModelId = (typeof CHAT_MODEL_IDS)[number];

/** $ per 1M tokens (input, cachedInput, output) for future billing. */
export const MODEL_PRICING: Record<ChatModelId, { input: number; cachedInput: number; output: number }> = {
	"gpt-5-mini": { input: 0.25, cachedInput: 0.025, output: 2 },
	"gpt-5": { input: 1.25, cachedInput: 0.125, output: 10 },
};

const REWRITE_KEYWORDS = ["rewrite", "improve", "rewrite section", "make it stronger"];
const AUTO_COMPLEX_MESSAGE_LENGTH = 1500;

function suggestsRewriteOrImprove(text: string): boolean {
	const lower = text.toLowerCase().trim();
	return REWRITE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Select the model for this request. When userSelectedModel is set and not "auto", use it (validated).
 * Otherwise (auto): default gpt-5-mini; upgrade to gpt-5 for long or rewrite/improve-style messages.
 */
export function selectModel({
	userSelectedModel,
	lastMessageText,
	toolCalls,
}: {
	userSelectedModel?: string;
	lastMessageText: string;
	toolCalls: boolean;
}): ChatModelId {
	if (userSelectedModel && userSelectedModel !== "auto") {
		const allowed = new Set(CHAT_MODEL_IDS);
		if (allowed.has(userSelectedModel as ChatModelId)) {
			return userSelectedModel as ChatModelId;
		}
	}

	// Auto: default gpt-5-mini; upgrade to gpt-5 for complex
	const isLong = lastMessageText.length > AUTO_COMPLEX_MESSAGE_LENGTH;
	const isRewriteIntent = suggestsRewriteOrImprove(lastMessageText);
	if (isLong || isRewriteIntent) {
		return "gpt-5";
	}
	return "gpt-5-mini";
}
