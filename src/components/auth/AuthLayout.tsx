import LandingHeader from "@/components/LandingHeader";

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
    <div className="min-h-screen flex flex-col gap-12 pb-12">
      <LandingHeader hideAuthButtons={true} />
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
