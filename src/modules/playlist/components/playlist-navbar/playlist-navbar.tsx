import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import Image from "next/image";
import Link from "next/link";
import { PlaylistCreateModal } from "../playlist-create-modal";

export function PlaylistNavBar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b px-3 pr-5 shadow-md">
      <div className="flex w-full items-center gap-4">
        <div className="flex shrink-0 items-center">
          <SidebarTrigger />

          <Link href="/playlist">
            <div className="flex items-center gap-2 p-4">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
              <p className="text-xl font-semibold tracking-tight">Playlist</p>
            </div>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <PlaylistCreateModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
