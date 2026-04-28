"use client";

import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ListMusic } from "lucide-react";
import Link from "next/link";

export function PlaylistSideBar() {
  return (
    <Sidebar className="z-40 pt-40" collapsible="icon">
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Playlist" asChild>
              <Link href="/playlist">
                <ListMusic className="size-5" />
                <span className="text-sm">Playlist</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Separator className="my-2" />

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Exit playlist" asChild>
              <Link href="/">
                <ListMusic className="size-5" />
                <span className="text-sm">Exit playlist</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  );
}
