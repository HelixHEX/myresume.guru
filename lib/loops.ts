import { LoopsClient } from "loops";

export const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

//example usage
// await loops.sendEvent({
//   email: user.emailAddresses[0].emailAddress,
//   eventName: "Email Added on Step 1",
// })