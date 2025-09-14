"use client";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { scrollToElement } from "@/lib/utils/smoothScroll";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WaitlistHeader() {
  return (
    <header className="relative z-10 pt-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 p-4 bg-dark-card border-main">
          <div className="flex items-center justify-between px-4">
            <Link className="flex items-center " href="/">
              <Image src={logo} alt="LeadMate" height={100} width={150} />
            </Link>

            <nav className="hidden md:flex items-center ">
              <Button onClick={() => scrollToElement("contact")}>
                Contact us
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
