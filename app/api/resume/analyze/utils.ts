import prisma from "@/lib/prisma";

export class StreamingResponse extends Response {
  constructor(res: ReadableStream<any>, init?: ResponseInit) {
    super(res as any, {
      ...init,
      status: 200,
      headers: {
        ...init?.headers,
      },
    });
  }
}

export const makeStream = <T extends Record<string, unknown>>(
  generator: AsyncGenerator<T, void, unknown>
) => {
  const encoder = new TextEncoder();
  return new ReadableStream<any>({
    async start(controller) {
      for await (let chunk of generator) {
        const chunkData = encoder.encode(JSON.stringify(chunk));
        controller.enqueue(chunkData);
      }
      controller.close();
    },
  });
};

// export async function* getFeedback(): AsyncGenerator<Item, void, unknown> {
//   let lastIndex = 0;
//   const sleep = async (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));
//   let last;
//   for (let i = 0; i < 30; i++) {
//     await sleep(1000);
//     const feedback = await prisma.feedback.findMany({
//       where: { id: { gt: lastIndex } },
//     })
//     if (feedback.length > 0) {
//       lastIndex = feedback[feedback.length - 1].id;
//       last = feedback[feedback.length - 1];
//       yield {
//         key: last.id.toString(),
//         value: last
//       };
//     }
//   }
// }

export async function* getFeedback(id?: string): AsyncGenerator<Item, void, unknown> {
  const sleep = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    yield {
      key: `key${i}`,
      value: {
        id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "userId",
        title: "Improve Skills",
        text: "just improve them",
        status: "status",
      },
    };
  }
}
