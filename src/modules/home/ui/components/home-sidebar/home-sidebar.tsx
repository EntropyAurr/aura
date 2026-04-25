import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";

export function HomeSideBar() {
  return (
    <Sidebar className="z-40 flex shrink-0 items-center border-none pt-18" collapsible="icon">
      <SidebarTrigger />

      <SidebarContent className="bg-background">
        <div>Side bar</div>
      </SidebarContent>
    </Sidebar>
  );
}
