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

      {/* CTA Buttons */}
      {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={scrollToContact}
          className="bg-main text-dark-bg font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-400 transform hover:-translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]"
        >
          Contact Us
        </button>
        <button className="border-2 border-main text-main font-bold py-4 px-8 rounded-lg text-lg hover:bg-main hover:text-dark-bg transition-all duration-300 transform hover:-translate-y-1">
          Learn More
        </button>
      </div> */}
    </>
  );
}
