import Link from "next/link";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
};

export default async function ChatsList({ chats }: { chats: Chat[] }) {
  // const chats: Chat[] = [
  //   {
  //     id: "1",
  //     name: "+1 555-0100",
  //     lastMessage: "Hi, is this available?",
  //     time: "2m",
  //   },
  //   { id: "2", name: "+44 20 7946 0958", lastMessage: "Thanks!", time: "15m" },
  //   {
  //     id: "3",
  //     name: "+971 50 123 4567",
  //     lastMessage: "When do you open?",
  //     time: "1h",
  //   },
  // ];

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
