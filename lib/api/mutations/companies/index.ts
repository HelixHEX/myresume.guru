import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "sonner";

const addCompany = async ({
  name,
  website,
}: {
  name: string;
  website: string;
}) => {
  const res = await axios.post("/api/companies", { name });
  return res.data;
};

export const useAddCompany = (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setWebsite: React.Dispatch<React.SetStateAction<string>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_company"],
    mutationFn: addCompany,
    onError: () => {
      toast.error("Error adding company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setName("");
      setWebsite("");
    },
  });
};
