import { getMessagesFromDb } from "@/actions";
import { useQuery } from "@tanstack/react-query";

const getMessages = async (resumeId?: Resume['id']) => {
  const {messages, resume} = await getMessagesFromDb(resumeId);
  return {messages, resume};
};

export const useGetMessages = ({
  resumeId,
  enabled = false,
}: {
  resumeId?: Resume['id'];
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["getMessages", resumeId],
    queryFn: () => getMessages(resumeId),
    enabled,
  });
};
