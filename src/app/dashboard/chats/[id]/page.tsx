// import ChatHeader from "@/components/dashboard/chats/ChatHeader";
// import ChatMessages from "@/components/dashboard/chats/ChatMessages";
// import ChatInput from "@/components/dashboard/chats/ChatInput";
import { RealtimeChat } from "@/components/dashboard/chats/realtime-chat";
import { createClient } from "@/lib/supabase/server";
import { getUserName } from "@/lib/utils/utils";

type Params = { params: { id: string } };

export default async function ChatDetailPage({ params }: Params) {
  const {id} = await params;
  const supabase = await createClient();
  const { data: {user} } = await supabase.auth.getUser();
  if (!user) {
    return <div>User not found</div>;
  }
  // const name = `Chat ${id}`;
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] m-4 rounded-base border overflow-hidden">
      {/* <ChatHeader name={name} />
      <ChatMessages />
      <ChatInput /> */}
      <RealtimeChat roomName={id} username={getUserName(user.email!)} />
    </div>
  );
}
