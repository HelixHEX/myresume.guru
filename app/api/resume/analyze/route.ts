import { NextResponse } from "next/server";

function sleep(time: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('done');
      resolve;
    }, time)
  );
}

export const POST = async () => {
  console.log("hit");

  await sleep(20000);

  return NextResponse.json({ url: "http://locahost:3000/app" });
};
