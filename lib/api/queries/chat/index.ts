import { getMessagesFromDb } from "@/actions";
import { useQuery } from "@tanstack/react-query";

const getMessages = async (fileKey: Resume['fileKey']) => {
  const {messages, resume} = await getMessagesFromDb(fileKey);
  return {messages, resume};
};

export const useGetMessages = ({
  fileKey,
  enabled = false,
}: {
  fileKey: Resume['fileKey'];
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["getMessages", fileKey],
    queryFn: () => getMessages(fileKey),
    enabled,
  });
};
