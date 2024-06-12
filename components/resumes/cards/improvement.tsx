import { MoveRight } from "lucide-react";
import FeedbackSuggestion from "../feedbackSuggestion";

type Props = {
  title?: Feedback["title"];
  text?: Feedback["text"];
  actionableFeedbacks?: ActionableFeedback[];
};

export default function ImprovementCard({
  title,
  text,
  actionableFeedbacks,
}: Props) {
  return (
    <>
      <div className="flex flex-row w-full mb-12  ">
        <div className="bg-gray-200 w-12 h-12 flex rounded-lg items-center mr-4 justify-center ">
          <MoveRight />
        </div>
        <div className="w-full">
          <h2 className="font-semibold text-xl">{title}</h2>
          {title ? (
            <>
              <p className=" text-gray-400">{text}</p>
              {actionableFeedbacks?.map((feedback, index) => (
                <div className="mt-4 w-full" key={index}>
                  <p className="font-semibold">{feedback.title}</p>
                  <p className="text-sm text-gray-400">{feedback.text}</p>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
      {/* <FeedbackSuggestion /> */}
    </>
  );
}
