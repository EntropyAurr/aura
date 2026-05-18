"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PlaylistMenu } from "../ui/components/playlist-menu";

export function LibraryView() {
  return (
    <Suspense fallback={<p>Loading Library...</p>}>
      <ErrorBoundary fallback={<p>Error Library</p>}>
        <LibraryViewSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function LibraryViewSuspense() {
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
            <Link href={`/playlist/${playlist.id}`}>
              <h2 className="text-xl font-medium">{playlist.title}</h2>
            </Link>

            <PlaylistMenu playlist={playlist} />
          </div>
        ))}
    </div>
  );
}
