import RedirectCountdown from "@/components/RedirectCountdown";


export default function ComingSoonPage() {

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen">
      <h1 className="text-4xl font-bold text-center text-main">
        We will be available soon
      </h1>
      <RedirectCountdown seconds={5} />
    </div>
  );
}
