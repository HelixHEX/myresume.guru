import { getMessagesFromDb } from "@/actions";
import { useQuery } from "@tanstack/react-query";

const getMessages = async (resumeId: number) => {
  const messages = await getMessagesFromDb(resumeId);
  return messages;
};

export const useGetMessages = ({
  resumeId,
  enabled = false,
}: {
  resumeId: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["getMessages", resumeId],
    queryFn: () => getMessages(resumeId),
    enabled,
  });
};
