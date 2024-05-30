'use server';
import prisma from "@/lib/prisma";

export default async function Feedback(){
  const feedbacks = await getFeedbacks();

  return (
    <div>
      {feedbacks.map((feedback, index) => (
        <div key={index}>
          <p>{feedback.title}</p>
          <p>{feedback.text}</p>
        </div>
      ))}
    </div>
  )
}

export const getFeedbacks = async () => {
  return await prisma.feedback.findMany();
}


