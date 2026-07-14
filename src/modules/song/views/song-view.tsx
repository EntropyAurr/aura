"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { useMusicStreaming } from "@/provider/music-streaming-provider";
import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { SongMenu } from "../ui/components/song-menu";
import { formatDuration } from "@/utils/helpers";

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
        <li key={songDetail.psId} className="mt-4 grid w-full grid-cols-[15rem_8rem_6rem_4rem] items-center justify-between">
          <p
            className="cursor-pointer font-semibold"
            onClick={() => {
              if (songDetail.songId === null) return;
              handlePlaySong(songDetail.songId, flatSongs);
            }}
          >
            {songDetail.songs?.title}
          </p>

          <span>{songDetail.songs?.artist}</span>
          <span>{formatDuration(songDetail.songs?.duration)}</span>

          <SongMenu song={songDetail} />
        </li>
      ))}
    </ul>
  );
}
