"use client";

import { useState } from "react";

// type Props = { onSend?: (text: string) => void };

export default function ChatInput() {
  const [text, setText] = useState("");

  const handleSend = async (text: string) => {
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: "+201129451762", message: text }),
    });
    const data = await res.json();
    alert(data.success ? "Message sent!" : "Error: " + data.error);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        handleSend(value);
      }}
      className="border-t p-3 flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-3 py-2 rounded-base border"
      />
      <button className="px-3 py-2 rounded-base border">Send</button>
    </form>
  );
}
