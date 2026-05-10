"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistSection } from "../ui/sections/playlist-section";
import { PlaylistMenu } from "../ui/components/playlist-menu";

export function LibraryView() {
  const [playlists] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  );

  return (
    <div className="flex flex-col gap-4">
      {playlists.pages
        .flatMap((page) => page.items)
        .map((playlist) => (
          <div key={playlist.id} className="flex w-2xl items-center justify-between">
            <PlaylistSection playlist={playlist} />
            <PlaylistMenu playlist={playlist} />
          </div>
        ))}
    </div>
  );
}
