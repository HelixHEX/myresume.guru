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
import { Card, CardContent } from "@/components/ui/card";
import { DialogClose } from "@radix-ui/react-dialog";

export default function CreateCard({
  children,
  title,
  modalTitle,
  modalDescription,
  actionText,
  action,
  styles,
  loading,
  close
}: {
  loading?: boolean;
  close?: boolean;
  styles?: string;
  title: string;
  modalTitle: string;
  modalDescription: string;
  children?: React.ReactNode;
  actionText: string;
  action: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full min-h-[180px] h-full flex items-center border-gray-200 hover:cursor-pointer border-dashed border-2">
          <Button className="hover:bg-white hover:cursor-pointer h-full w-full self-center bg-white">
            <CardContent className="flex w-full flex-col ">
              <h1 className="text-gray-400 ">{title}</h1>
            </CardContent>
          </Button>
        </Card>
      </DialogTrigger>

      <DialogContent className={`${styles ? styles : ""}`}>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="">
          {children}
        </div>
        <DialogFooter>
          <DialogClose asChild={close}>
            <Button
            className="md:w-auto w-full"
              disabled={loading}
              onClick={action}
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
