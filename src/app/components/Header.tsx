import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-secondary" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              ReplyPro
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/waitlist"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Waitlist
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-primary hover:bg-primary/80 text-black px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
