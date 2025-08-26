import { CircleCheckBig } from "lucide-react";

export default function WaitlistSuccess() {
  return (
    <div className="max-w-md mx-auto mb-12">
      <div className="rounded-2xl border-4 p-6 bg-dark-card border-main shadow-[8px_8px_0px_0px_rgba(57,255,20,0.8)]">
        <div className="text-center">
          <CircleCheckBig className="w-16 h-16 text-main mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">
            You&apos;re on the list! 🎉
          </h3>
          <p className="text-text-light">
            We&apos;ll notify you as soon as LaedMate launches. Get ready to
            never miss another lead again!
          </p>
        </div>
      </div>
    </div>
  );
}
