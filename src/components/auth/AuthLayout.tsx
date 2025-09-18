import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen  flex flex-col justify-center gap-12 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mx-auto bg-border rounded-lg p-4 flex items-center gap-4 group"
      >
        <ArrowLeft className="size-10 group-hover:-translate-x-1 group-hover:scale-110  transition-all duration-300" />
        <Image src="/logo.png" alt="LeadMate" width={200} height={200} />
      </Link>
      <div className="flex flex-col items-center justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold">{title}</h2>
          <p className="mt-2 text-center text-sm">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
