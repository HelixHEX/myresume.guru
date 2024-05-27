import pdf from "pdf-parse";
import prisma from "./prisma";

export async function* streamingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    if (reader === undefined) {
      return;
    }
    const { done, value } = await reader?.read();

    if (done) break;

    try {
      yield decoder.decode(value);
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}

export const convertPDFToText = async (fileKey: string) => {
  try {
    const url = process.env.UPLOADTHING_API_URL + fileKey;
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const response = await pdf(buffer);
    if (!response.text) {
      throw new Error("No text found in PDF");
    }

    await prisma.resume.update({
      where: { fileKey },
      data: { text: response.text },
    });
    return response.text;
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
};
