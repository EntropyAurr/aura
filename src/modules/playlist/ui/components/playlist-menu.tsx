"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RouterOutputs, trpc } from "@/trpc/client";
import { MoreVerticalIcon, SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PlaylistRenameModal } from "./playlist-rename-modal";

type PlaylistGetManyOuput = RouterOutputs["playlists"]["getMany"]["items"][number];

interface PlaylistMenuProps {
  playlist: PlaylistGetManyOuput;
  variants?: "ghost" | "secondary";
}

export function PlaylistMenu({ playlist, variants = "ghost" }: PlaylistMenuProps) {
  const [renameOpen, setRenameOpen] = useState(false);

  const utils = trpc.useUtils();

  const updatePlaylist = trpc.playlists.update.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      utils.playlists.getOne.invalidate({ id: playlist.id });
      toast.success("Playlist updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variants} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => setRenameOpen(true)}>
          <SquarePen className="size-4" />
          Rename
        </DropdownMenuItem>

        <PlaylistRenameModal
          open={renameOpen}
          onOpenChange={setRenameOpen}
          currentTitle={playlist.title ?? ""}
          isPending={updatePlaylist.isPending}
          onRename={(title) => {
            updatePlaylist.mutate({ id: playlist.id, title }, { onSuccess: () => setRenameOpen(false) });
          }}
        />

        <DropdownMenuItem onClick={() => {}}>
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
