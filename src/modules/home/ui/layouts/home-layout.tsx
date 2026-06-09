import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavBar } from "../components/home-navbar/home-navbar";
import { HomeSideBar } from "../components/home-sidebar/home-sidebar";
import { PlayerBar } from "../components/player-bar/player-bar";
import MusicStreamingProvider from "@/provider/music-streaming-provider";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>
      <MusicStreamingProvider>
        <div className="flex h-screen w-full flex-col">
          <HomeNavBar />

          <div className="flex min-h-screen pt-16">
            <HomeSideBar />

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>

          <PlayerBar />
        </div>
      </MusicStreamingProvider>
    </SidebarProvider>
  );
}
