"use client";

export default function WaitlistHero() {
  return (
    <div className="contents">
      {/* Main Headline */}
      <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
        Never miss another
        <span className="block text-main">
          <span className="fire-text">hot</span> lead again
        </span>
      </h1>

      {/* Description */}
      <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white">
        Set up your AI sales agent on WhatsApp in under 5 minutes. Answer
        questions, share menus, collect leads, and close deals while you sleep.
        Perfect for restaurants, salons, gyms, and local businesses.
      </p>
    </div>
  );
}
