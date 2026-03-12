export type CreditPackId = "small" | "medium" | "large";

export type CreditPack = {
  id: CreditPackId;
  /** Human-readable label shown in the UI, e.g. Starter, Pro, Team. */
  label: string;
  /** Price in whole USD for display only. The actual charge comes from the Polar product. */
  priceUsd: number;
  /** Number of credits granted when this pack is purchased once. */
  credits: number;
  /**
   * Name of the env var that holds the Polar product ID for this pack.
   * Example: POLAR_CREDIT_PACK_SMALL_PRODUCT_ID
   */
  envProductIdKey: string;
};

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "small",
    label: "Starter",
    priceUsd: 5,
    credits: 400,
    envProductIdKey: "POLAR_CREDIT_PACK_SMALL_PRODUCT_ID",
  },
  {
    id: "medium",
    label: "Pro",
    priceUsd: 10,
    credits: 800,
    envProductIdKey: "POLAR_CREDIT_PACK_MEDIUM_PRODUCT_ID",
  },
  {
    id: "large",
    label: "Team",
    priceUsd: 25,
    credits: 2000,
    envProductIdKey: "POLAR_CREDIT_PACK_LARGE_PRODUCT_ID",
  },
];

export const CREDIT_PACKS_BY_ID: Record<CreditPackId, CreditPack> = CREDIT_PACKS.reduce(
  (acc, pack) => {
    acc[pack.id] = pack;
    return acc;
  },
  {} as Record<CreditPackId, CreditPack>,
);

export function getCreditPackById(id: string | null | undefined): CreditPack | undefined {
  if (!id) return undefined;
  return CREDIT_PACKS_BY_ID[id as CreditPackId];
}


