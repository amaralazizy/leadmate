"use client";

import { useState } from "react";

type Props = { onSend?: (text: string) => void };

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        onSend?.(value);
        setText("");
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
