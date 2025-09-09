import ChatsList from "@/components/dashboard/chats/ChatsList";
import { getChats } from "@/actions";

export default async function ChatsPage() {
  const chats = await getChats();
  return <ChatsList chats={chats} />;
}
