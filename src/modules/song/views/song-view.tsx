"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { SongMenu } from "../ui/components/song-menu";

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
        .map((songDetail) => (
          <div key={songDetail.psId} className="flex w-2xl items-center justify-between">
            <span>{songDetail.songs?.title}</span>
            <span>{songDetail.songs?.artist}</span>
            <span>{songDetail.songs?.duration}</span>

            <SongMenu song={songDetail} />
          </div>
        ))}
    </div>
  );
}
