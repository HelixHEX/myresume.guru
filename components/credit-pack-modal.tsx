"use client";

import { useState, useTransition } from "react";
import { CoinsIcon } from "lucide-react";
import { CREDIT_PACKS, type CreditPackId } from "@/lib/credit-packs";
import { createCreditPackCheckout } from "@/lib/actions/checkout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CreditPackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreditPackModal({ open, onOpenChange }: CreditPackModalProps) {
  const [selectedPackId, setSelectedPackId] = useState<CreditPackId>("small");
  const [isPending, startTransition] = useTransition();

  const handleSelectPack = (packId: CreditPackId) => {
    if (isPending) return;
    setSelectedPackId(packId);
  };

  const handleConfirm = () => {
    if (!selectedPackId || isPending) return;
    startTransition(() => {
      void createCreditPackCheckout(selectedPackId);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label="Choose a credit pack"
        className="max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CoinsIcon className="size-5 text-amber-500" aria-hidden />
            Choose a credit pack
          </DialogTitle>
          <DialogDescription>
            Buy AI credits in fixed packs. Each AI reply uses about 4 credits.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-3">
          {CREDIT_PACKS.map((pack) => {
            const isSelected = pack.id === selectedPackId;
            const estimatedMessages = Math.floor(pack.credits / 4);

            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => handleSelectPack(pack.id)}
                disabled={isPending}
                className={[
                  "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSelected
                    ? "border-amber-500 bg-amber-50/60 dark:bg-amber-500/10"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
                ].join(" ")}
                aria-pressed={isSelected}
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    ${pack.priceUsd} credit pack
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {pack.credits.toLocaleString()} credits · ~
                    {estimatedMessages.toLocaleString()} messages
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Redirecting…" : "Continue to checkout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

