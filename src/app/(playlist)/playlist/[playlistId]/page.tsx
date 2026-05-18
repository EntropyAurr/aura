import { HydrateClient, trpc } from "@/trpc/server";
import { PlaylistView } from "@/modules/playlist/views/playlist-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ id: Number(playlistId) });

  return (
    <HydrateClient>
      <PlaylistView playlistId={Number(playlistId)} />
    </HydrateClient>
  );
}
