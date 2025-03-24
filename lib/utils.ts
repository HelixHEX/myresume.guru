import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import pdf from "pdf-parse";
import { logger } from "@trigger.dev/sdk/v3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileUrl = (fileKey: string) => {
  const url = new URL(`${process.env.UPLOAD_THING_FILE_URL}/${fileKey}`)
  return url.toString()
}

export const getFile = async (fileKey: string) => {
  const url = getFileUrl(fileKey)
  logger.info("Getting file from URL", { url })
  const response = await fetch(url)
  const blob = await response.blob();
  return await blob.arrayBuffer();
}

export function getUrl(url: string) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000${url}`;
  }

  if (process.env.URL === "https://www.myresume.guru") {
    return `https://www.myresume.guru${url}`;
  }

  console.log("[UTILS][GET URL]", `${process.env.URL}${url}`)
  return `${process.env.URL}${url}`
}