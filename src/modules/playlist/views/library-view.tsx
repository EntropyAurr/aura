"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";

console.log("trpc keys:", Object.keys(trpc));

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
    <div>
      {playlists.pages
        .flatMap((page) => page.items)
        .map((playlist) => (
          <Link href={`/playlist/${playlist.id}`} key={playlist.id}>
            {playlist.title}
          </Link>
        ))}
    </div>
  );
}
