import { SidebarProvider } from "@/components/ui/sidebar";
import { PlaylistNavBar } from "../components/playlist-navbar/playlist-navbar";
import { PlaylistSideBar } from "../components/playlist-sidebar/playlist-sidebar";
import { PlayerBar } from "@/modules/home/ui/components/player-bar/player-bar";
import MusicStreamingProvider from "@/provider/music-streaming-provider";

interface PlaylistLayoutProps {
  children: React.ReactNode;
}

export function PlaylistLayout({ children }: PlaylistLayoutProps) {
  return (
    <SidebarProvider>
      <MusicStreamingProvider>
        <div className="w-full">
          <PlaylistNavBar />

          <div className="flex min-h-screen pt-16">
            <PlaylistSideBar />

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>

          <PlayerBar />
        </div>
      </MusicStreamingProvider>
    </SidebarProvider>
  );
}
