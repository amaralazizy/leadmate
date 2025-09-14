"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface WaitlistFormProps {
  onSuccess: () => void;
}

export default function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // console.log("email", JSON.stringify({ email }));
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.log("error", error);
        toast.error(error.error || "Failed to join waitlist");
        // alert(error.error || "Failed to join waitlist");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      alert("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
      <div className="rounded-2xl border-2 p-6 bg-dark-card border-main shadow-[8px_8px_0px_0px_rgba(57,255,20,0.8)]">
        <div className="relative mb-4">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-main" />
          <input
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your business email..."
            className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all bg-dark-secondary border-2 border-main text-white placeholder:text-text-light"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Joining...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Get My AI Sales Agent
              <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
