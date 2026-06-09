"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { SongMenu } from "../ui/components/song-menu";
import { Button } from "@/components/ui/button";
import { useMusicStreaming } from "@/provider/music-streaming-provider";

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

  const flatSongs = songs.pages.flatMap((page) => page.items);

  const { handlePlaySong } = useMusicStreaming();

  return (
    <ul className="mt-5 w-full">
      {flatSongs.map((songDetail) => (
        <li key={songDetail.psId} className="mt-4 flex w-full items-center justify-between">
          <Button
            onClick={() => {
              if (songDetail.songId === null) return;
              handlePlaySong(songDetail.songId, flatSongs);
            }}
          >
            <span>{songDetail.songs?.title}</span>
          </Button>

          <span>{songDetail.songs?.artist}</span>
          <span>{songDetail.songs?.duration}</span>

          <SongMenu song={songDetail} />
        </li>
      ))}
    </ul>
  );
}
