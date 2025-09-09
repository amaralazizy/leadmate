import Link from "next/link";
import { getChats } from "@/actions";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  customer_phone: string;
  status: string;
};

// const supabase = await createClient();

export default async function ChatsList() {
  // const chats: Chat[] = [
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const chats: Chat[] = await getChats(user.id);
  return (
    <section className="p-4 md:p-6">
      <h1 className="text-xl font-heading mb-4">Chats</h1>
      <div className="rounded-base border divide-y">
        {chats.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/chats/${c.id}`}
            className="block p-4 hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading">{c.name}</p>
                <p className="text-sm text-muted-foreground truncate max-w-[36ch]">
                  {c.lastMessage}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{c.time}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
