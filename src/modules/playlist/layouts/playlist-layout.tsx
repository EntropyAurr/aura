import { SidebarProvider } from "@/components/ui/sidebar";
import { PlaylistNavBar } from "../components/playlist-navbar/playlist-navbar";
import { PlaylistSideBar } from "../components/playlist-sidebar/playlist-sidebar";

interface PlaylistLayoutProps {
  children: React.ReactNode;
}

export function PlaylistLayout({ children }: PlaylistLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <PlaylistNavBar />

        <div className="flex min-h-screen pt-18">
          <PlaylistSideBar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
