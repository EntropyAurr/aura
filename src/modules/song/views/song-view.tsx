"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

interface SongViewProps {
  playlistId: number;
}

export function SongView({ playlistId }: SongViewProps) {
  const [songs] = trpc.songs.getMany.useSuspenseInfiniteQuery(
    { id: playlistId, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  );

  return (
    <div className="mt-5">
      {songs.pages
        .flatMap((page) => page.items)
        .map((song) => (
          <div key={song.id} className="flex w-2xl items-center justify-between">
            <span>{song.title}</span>
            <span>{song.artist}</span>
            <span>{song.duration}</span>
          </div>
        ))}
    </div>
  );
}
