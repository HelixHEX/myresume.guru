import { createCheckoutSession } from "@/lib/actions/checkout"
import { useMutation } from "@tanstack/react-query"

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: createCheckoutSession,
  })
}