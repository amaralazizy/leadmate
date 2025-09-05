import ChatHeader from "@/components/dashboard/chats/ChatHeader";
import ChatMessages from "@/components/dashboard/chats/ChatMessages";
import ChatInput from "@/components/dashboard/chats/ChatInput";

type Params = { params: { id: string } };

export default async function ChatDetailPage({ params }: Params) {
  const {id} = await params;
  
  const name = `Chat ${id}`;
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] m-4 rounded-base border overflow-hidden">
      <ChatHeader name={name} />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
