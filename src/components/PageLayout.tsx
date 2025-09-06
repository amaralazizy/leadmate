import LandingHeader from "@/components/LandingHeader";
import GlobalFooter from "@/components/GlobalFooter";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <GlobalFooter />
    </div>
  );
}
