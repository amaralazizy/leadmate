import Link from "next/link";

export default function WaitlistCTA() {
  return (
    <div className="rounded-3xl border-4 p-8 md:p-12 bg-dark-card border-accent-green shadow-[12px_12px_0px_0px_rgba(57,255,20,0.8)]">
      <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
        Ready to revolutionize your customer service?
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-text-light">
        Don&apos;t miss out on the future of AI-powered customer support. Join
        the waitlist and be among the first to experience the revolution.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-accent-green text-dark-bg"
        >
          Learn More
        </Link>
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center px-8 py-4 font-bold rounded-xl border-2 border-black shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-accent-green text-dark-bg"
        >
          Early Access
        </Link>
      </div>
    </div>
  );
}
