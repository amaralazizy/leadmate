"use client";

import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

const messages = [
  {
    id: 1,
    text: "Hey, do you have availability for this weekend?",
    sender: "user",
    delay: 0.5,
  },
  {
    id: 2,
    text: "Yes! We have a few slots open on Saturday. Would you like to book?",
    sender: "bot",
    delay: 1.5,
  },
  {
    id: 3,
    text: "Great, let's go with 2 PM.",
    sender: "user",
    delay: 3.5,
  },
  {
    id: 4,
    text: "Booked! I've sent the confirmation to your email.",
    sender: "bot",
    delay: 4.0,
  },
];

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-[350px] mx-auto perspective-1000">
      <motion.div
        initial={{ rotateY: -10, rotateX: 5, opacity: 0, y: 20 }}
        animate={{ rotateY: -5, rotateX: 2, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden h-[600px]"
      >
        {/* Screen Header */}
        <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white z-10 relative">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <div>
            <div className="font-semibold text-sm">LeadMate AI</div>
            <div className="text-[10px] opacity-80">online</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-[#e5ded8] dark:bg-zinc-950/50 h-full p-4 flex flex-col gap-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ChatBubble({ message }: { message: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: message.delay, duration: 0.3 }}
      className={`flex w-full ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm relative ${
          message.sender === "user"
            ? "bg-[#dcf8c6] text-black rounded-tr-none"
            : "bg-white text-black rounded-tl-none"
        }`}
      >
        {message.text}
        <div className="text-[10px] text-gray-500 text-right mt-1 flex justify-end items-center gap-1">
          12:0{message.id} PM
          {message.sender === "user" && (
            <CheckCheck className="w-3 h-3 text-blue-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
