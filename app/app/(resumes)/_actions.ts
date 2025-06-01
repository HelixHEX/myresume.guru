'use server';
import prisma from "@/lib/prisma";

export const incrementDownloadedResumes = async () => {
  await prisma.stats.update({
    where: { id: 1 },
    data: { downloadedResumes: { increment: 1 } },
  });
};

export const getDownloadedResumes = async () => {
  const stats = await prisma.stats.findUnique({
    where: { id: 1 },
  });
  return stats?.downloadedResumes;
};