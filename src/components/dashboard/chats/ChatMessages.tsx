type Message = {
  id: string;
  content: string;
  sender: "customer" | "agent";
};

export default async function ChatMessages() {
  const messages: Message[] = [
    { id: "m1", content: "Hello!", sender: "customer" },
    { id: "m2", content: "Hi, how can I help?", sender: "agent" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${
            m.sender === "agent" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-3 py-2 rounded-base max-w-[60ch] ${
              m.sender === "agent"
                ? "bg-main text-main-foreground"
                : "bg-accent"
            }`}
          >
            <p className="text-sm">{m.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
