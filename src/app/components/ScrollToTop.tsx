"use client";

import { scrollToTop } from "@/lib/utils/smoothScroll";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
            <Button onClick={scrollToTop} className="fixed bottom-8 right-8 size-10">
                <ArrowUp className="w-5 h-10" />
            </Button>
        ) : null
    )
}