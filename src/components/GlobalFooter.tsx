import Link from "next/link";
import { FooterNavLinks } from "@/lib/data/navLinks";

export default function GlobalFooter() {
  return (
    <footer className="mt-auto pt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 pb-8">
          {FooterNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-center pb-8 text-foreground">
          <p>&copy; {new Date().getFullYear()} LeadMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
