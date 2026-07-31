import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { SkipToContent } from "@/components/shared/skip-to-content";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <SkipToContent />
      <AuroraBackground />
      <Link href="/" className="relative z-10">
        <Logo />
      </Link>
      <div id="main-content" className="relative z-10 mt-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
