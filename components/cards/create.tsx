"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { title } from "process";

export default function CreateCard({
  children,
  title,
  modalTitle,
  modalDescription,
  actionText,
  action
}: {
  title: string;
  modalTitle: string;
  modalDescription: string;
  children?: React.ReactNode;
  actionText: string
  action: () => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full flex items-center border-gray-200 hover:cursor-pointer border-dashed border-2 md:w-[270px] lg:w-[320px] h-[180px]">
          <Button className="hover:bg-white h-full w-full self-center bg-white">
            <CardContent className="flex w-full flex-col ">
              <h1 className="text-gray-400 ">{title}</h1>
            </CardContent>
          </Button>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {children}
            {/* <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              id="name"
              placeholder="Company url (ex: careers.google.com)"
              className="col-span-3"
            /> */}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              // onClick={() => {
              //   mutate({ name, website: website ?? "" });
              // }}
              type="submit"
            >
              {actionText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
