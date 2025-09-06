"use client";

import { scrollToTop } from "@/lib/utils/smoothScroll";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        isVisible ? (
            <button onClick={scrollToTop} className="cursor-pointer fixed bottom-8 right-8 bg-main text-dark-bg px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-300">
                <ArrowUp className="w-5 h-10" />
            </button>
        ) : null
    )
}