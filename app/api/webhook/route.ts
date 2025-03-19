import prisma from '@/lib/prisma';
import { type NextRequest } from 'next/server';
import { Client } from "@upstash/qstash";
import { z } from 'zod'

export async function POST(req: NextRequest) {
  const body = await req.json();
  const qstashClient = new Client({ token: process.env.QSTASH_TOKEN || "" });

  const queue = qstashClient.queue({ queueName: process.env.QTASH_QUEUE });

  const IncomingWebhookDataSchema = z.object({
    environment: z.string().optional(),

  })
}