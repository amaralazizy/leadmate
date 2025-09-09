"use client";

import { useEffect, useState } from "react";
    import { useRouter } from "next/navigation";

export default function RedirectCountdown({ seconds }: { seconds: number }) {
  const [countdown, setCountdown] = useState(seconds);
  const router = useRouter();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="text-2xl font-bold text-center text-main">
      You will be redirected to the home page in
      <div className="text-4xl font-bold text-center text-main">{countdown}</div>
    </div>
  );
}