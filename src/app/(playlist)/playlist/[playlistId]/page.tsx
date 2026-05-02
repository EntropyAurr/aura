import { PlaylistView } from "@/modules/playlist/views/playlist-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    playlistId: number;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ id: playlistId });

  return (
    <HydrateClient>
      <PlaylistView playlistId={playlistId} />
    </HydrateClient>
  );
}
