import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import Image from "next/image";
import Link from "next/link";

export function HomeNavBar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-18 items-center px-3 pr-5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex shrink-0 items-center">
          <SidebarTrigger />

          <Link href="/">
            <div className="flex items-center gap-2 p-4">
              <Image src="/logo.png" alt="logo" width={40} height={40} className="rounded-full" />
              <p className="text-xl font-semibold tracking-tight">Aurora</p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-4">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
