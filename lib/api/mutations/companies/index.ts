import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { toast } from "sonner";

const addCompany = async (name: string) => {
  // const res = await axios.post("/api/companies", { name });
  // return res.data;
  // alert(name);
  throw new Error("Error adding company");
  // return name;
};

export const useAddCompany = (
  setName: React.Dispatch<React.SetStateAction<string>>
) => {
  return useMutation({
    mutationKey: ["add_company"],
    mutationFn: addCompany,
    onError: () => {
      toast.error("Error adding company");
    },
    onSuccess: () => {
      setName("");
    },
  });
};
