"use client";

import { cn } from "@/lib/utils/index";
import { ChatMessageItem } from "@/components/dashboard/chats/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { type ChatMessage, useRealtimeChat } from "@/hooks/use-realtime-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, MoreVertical, Bot } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type RealtimeChatProps = {
  roomName: string;
  username: string;
  onMessage?: (messages: ChatMessage[]) => void;
  messages?: ChatMessage[];
};

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  });
  const [newMessage, setNewMessage] = useState("");

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages];

    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id)
    );
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) =>
      a.timestamp?.localeCompare(b.timestamp)
    );

    return sortedMessages;
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages);
    }
  }, [allMessages, onMessage]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      const messageToSend = newMessage;
      setNewMessage("");

      // Show typing indicator for assistant response simulation
      setIsTyping(true);

      try {
        // Send message - this will automatically store in DB and update UI via realtime
        await sendMessage(messageToSend, "bot");
      } catch (error) {
        console.error("Failed to send message:", error);
        setIsTyping(false);
        setNewMessage(messageToSend); // Restore message on error
      }
    },
    [newMessage, isConnected, sendMessage]
  );

  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing indicator when sending message
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 100%)",
        }}
      >
        {allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary-background border-2 border-border flex items-center justify-center">
              <Send className="w-8 h-8 text-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground/80 mb-2">
                Start the conversation
              </p>
              <p className="text-sm text-foreground/60 max-w-sm">
                No messages yet. Send a message to begin chatting with your
                customer.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {allMessages.map((message, index) => {
              const prevMessage = index > 0 ? allMessages[index - 1] : null;
              const nextMessage =
                index < allMessages.length - 1 ? allMessages[index + 1] : null;

              const showHeader =
                !prevMessage ||
                prevMessage.sender !== message.sender ||
                new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime() >
                  300000; // 5 minutes

              const showAvatar =
                showHeader ||
                !nextMessage ||
                nextMessage.sender !== message.sender;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.sender === "bot"}
                    showHeader={showHeader}
                    showAvatar={showAvatar}
                  />
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex gap-3 mb-4 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-main flex items-center justify-center">
                      <Bot className="w-4 h-4 text-main-foreground" />
                    </div>
                  </div>
                  <div className="max-w-[75%] flex flex-col items-start">
                    <div className="relative px-4 py-3 rounded-2xl rounded-bl-md bg-secondary-background border border-border shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 -ml-1 w-3 h-3 transform rotate-45 bg-secondary-background border-l border-b border-border" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-secondary-background/50 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex items-end gap-3">
            {/* Message input */}
            <div className="flex-1 relative">
              <Input
                className={cn(
                  "min-h-[40px] max-h-[120px] py-3 pr-12 pl-4 rounded-2xl border-2 resize-none",
                  "transition-all duration-200 focus:border-main focus:ring-2 focus:ring-main/20",
                  "bg-background shadow-sm"
                )}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>

            {/* Send button */}
            <Button
              type="submit"
              disabled={!isConnected || !newMessage.trim()}
              className={cn(
                "aspect-square h-10 rounded-full transition-all duration-200",
                newMessage.trim()
                  ? "bg-main text-main-foreground hover:bg-main/90 scale-100"
                  : "bg-accent text-accent-foreground scale-95 opacity-60"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Connection status */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-200",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span className="text-xs text-foreground/60">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {newMessage.length > 0 && (
              <span className="text-xs text-foreground/60">
                {newMessage.length}/1000
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
