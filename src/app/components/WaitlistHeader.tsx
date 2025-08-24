import Link from "next/link";
import { Star } from "lucide-react";

export default function WaitlistHeader() {
  return (
    <header className="relative z-10 pt-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 p-4 bg-dark-card border-accent-green shadow-[8px_8px_0px_0px] shadow-accent-green/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center bg-accent-green">
                <Star className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl text-white">
                AI WhatsApp Bot
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="font-medium transition-colors hover:text-white text-text-light"
              >
                Updates
              </Link>
              <Link
                href="/"
                className="font-medium transition-colors hover:text-white text-text-light"
              >
                FAQ
              </Link>
              <Link
                href="/"
                className="font-medium transition-colors hover:text-white text-text-light"
              >
                Contact us
              </Link>
            </nav>

            {/* <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-dark-secondary border-accent-green">
              <div className="w-4 h-4 rounded-full bg-accent-green" />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
