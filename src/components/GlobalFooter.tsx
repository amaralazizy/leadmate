import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer className="mt-auto pt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 pb-8">
          <Link
            href="/"
            className="text-foreground hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-foreground hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-foreground hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
        <div className="text-center pb-8 text-foreground">
          <p>&copy; 2024 LeadMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
