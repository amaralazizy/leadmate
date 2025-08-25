"use client";
import { useState } from "react";

export default function Home() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
    });
    const data = await res.json();
    alert(data.success ? "Message sent!" : "Error: " + data.error);
  }

  return (
    <div>
      <h1>Send WhatsApp Message</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Customer Number (e.g., +201234567890)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
