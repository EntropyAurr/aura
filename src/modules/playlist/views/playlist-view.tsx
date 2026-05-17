"use client";

import { Suspense, useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { SongCreateModal } from "@/modules/song/ui/components/song-create-modal";
import { SongView } from "@/modules/song/views/song-view";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  playlistId: number;
}

export function PlaylistView({ playlistId }: PageProps) {
  return (
    <Suspense fallback={<p>Loading Playlist...</p>}>
      <ErrorBoundary fallback={<p>Error Playlist</p>}>
        <PlaylistViewSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
}

export function PlaylistViewSuspense({ playlistId }: PageProps) {
  const [open, setOpen] = useState(false);

  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  return (
    <div className="w-full p-4">
      <div className="flex w-2xl items-center justify-between">
        <h2 className="text-xl font-bold">{playlist.title}</h2>

        <div>
          <Button onClick={() => setOpen(true)}>Add new song</Button>
          <SongCreateModal open={open} onClose={() => setOpen(false)} playlistId={playlistId} />
        </div>
      </div>

      <SongView playlistId={playlistId} />
    </div>
  );
}
