import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavBar } from "../components/home-navbar/home-navbar";
import { HomeSideBar } from "../components/home-sidebar/home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavBar />

        <div className="flex min-h-screen pt-18">
          <HomeSideBar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
