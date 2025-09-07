import { CheckCircle } from "lucide-react";

export default function TrustSignals() {
  return (
    <div className="mt-20 text-center flex items-center justify-center">
      <p className="text-foreground text-4xl flex flex-col items-center gap-8 xl:flex-row">
        <CheckCircle className="inline h-10 w-10 text-main mr-2" />
        <span>Secure, compliant, and designed for businesses</span>
      </p>
    </div>
  );
}
