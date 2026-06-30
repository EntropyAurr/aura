"use client";

import { useAuth } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { useMusicStreaming } from "@/provider/music-streaming-provider";
import { DEFAULT_LIMIT } from "@/constants";
import { SongMenu } from "../ui/components/song-menu";
import { Button } from "@/components/ui/button";

interface SongViewProps {
  playlistId: number;
}

export function SongView({ playlistId }: SongViewProps) {
  const { handlePlaySong } = useMusicStreaming();

  const { isLoaded, isSignedIn } = useAuth();

  const { data: songs, isLoading } = trpc.songs.getMany.useInfiniteQuery(
    { id: playlistId, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: isLoaded && isSignedIn,
    },
  );

  if (!isLoaded || isLoading) return <p>Loading songs...</p>;

  const flatSongs = songs?.pages.flatMap((page) => page.items);

  return (
    <ul className="mt-5 w-full">
      {flatSongs?.map((songDetail) => (
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
