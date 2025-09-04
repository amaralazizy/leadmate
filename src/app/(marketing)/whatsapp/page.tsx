"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");
        setTo("");
        setMessage("");
      } else {
        console.log("data", data);
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Send WhatsApp Message
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with your customers instantly through WhatsApp
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800">
              New Message
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the recipient's number and your message below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={sendMessage} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+201234567890"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="h-12 text-base"
                  required
                />
                <p className="text-xs text-gray-500">
                  Include country code (e.g., +1 for US, +44 for UK)
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                disabled={isLoading || !to || !message}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>Send Message</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Messages are sent securely through WhatsApp Business API
          </p>
        </div>
      </div>
    </div>
  );
}
