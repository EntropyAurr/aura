import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/playlist/views/library-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
  void trpc.playlists.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
}
