"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistSection } from "../ui/sections/playlist-section";
import { PlaylistMenu } from "../ui/components/playlist-menu";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
            <PlaylistSection playlist={playlist} />
            <PlaylistMenu playlist={playlist} />
          </div>
        ))}
    </div>
  );
}
