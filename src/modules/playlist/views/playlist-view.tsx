"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { SongCreateModal } from "@/modules/song/ui/components/song-create-modal";

interface PageProps {
  playlistId: number;
}

export function PlaylistView({ playlistId }: PageProps) {
  const [open, setOpen] = useState(false);

  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  return (
    <div className="p-4">
      <div className="flex w-2xl items-center justify-between">
        <h2 className="text-xl font-bold">{playlist.title}</h2>

        <div>
          <Button onClick={() => setOpen(true)}>Add new song</Button>
          <SongCreateModal open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
