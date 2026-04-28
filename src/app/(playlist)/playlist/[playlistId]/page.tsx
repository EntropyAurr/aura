import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { playlistId } = await params;

  return <HydrateClient>{playlistId}</HydrateClient>;
}
