import Image from "next/image";
import logo from "../../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";

export default function HeroSection() {
  return (
    <div className="text-center flex flex-col items-center gap-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image src={logo} alt="LeadMate" height={80} width={120} />
      </div>

      <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
        <span className="block">Smarter WhatsApp Conversations</span>
        <span className="block text-main">for Your Business</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground sm:text-xl md:mt-8">
        LeadMate helps you provide instant, AI-powered responses to your
        customers on WhatsApp — anytime, anywhere.
      </p>

      {/* CTA Button */}
      <NavigationButton className="px-12 py-8 text-2xl" href="/waitlist">Join the Waitlist</NavigationButton>
    </div>
  );
}
