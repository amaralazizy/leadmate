"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useState } from "react";

export default function WaitlistHeader() {
  const [copied, setCopied] = useState(false);

  const handleContactClick = async () => {
    try {
      await navigator.clipboard.writeText("hello@leadmate.ai");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <header className="relative z-10 pt-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 p-4 bg-dark-card border-accent-green shadow-[8px_8px_0px_0px] shadow-accent-green/80">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center ">
              <Image src={logo} alt="LeadMate" height={100} width={150} />
            </div>

            <nav className="hidden md:flex items-center ">
              <button
                onClick={handleContactClick}
                className="font-medium transition-colors hover:text-white text-text-light cursor-pointer"
              >
                {copied ? "Email copied!" : "Contact us"}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
