import { SidebarProvider } from "@/components/ui/sidebar";

interface PlaylistLayoutProps {
  children: React.ReactNode;
}

export function PlaylistLayout({ children }: PlaylistLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <PlaylistNavbar />

        <div className="flex min-h-screen pt-18">
          <PlaylistSidebar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
