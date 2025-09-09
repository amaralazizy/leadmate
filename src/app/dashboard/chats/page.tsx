import ChatsList from "@/components/dashboard/chats/ChatsList";
import { getChats } from "@/actions";

export default async function ChatsPage() {
  const chats = await getChats();
  console.log("chats", chats);
  return <ChatsList chats={chats} />;
}
