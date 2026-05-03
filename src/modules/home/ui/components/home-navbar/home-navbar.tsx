import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import Image from "next/image";
import Link from "next/link";

export function HomeNavBar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center px-3 pr-5 shadow-md">
      <div className="flex w-full items-center justify-between gap-4">
        <Link href="/">
          <div className="flex shrink-0 items-center gap-4 p-4">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <p className="text-xl font-semibold tracking-tight">AURA</p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-4">
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
