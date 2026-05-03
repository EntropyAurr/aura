import type { RouterOutputs } from "@/trpc/client";
import Link from "next/link";

type PlaylistGetManyOuput = RouterOutputs["playlists"]["getMany"]["items"][number];

interface PlaylistSectionProps {
  playlist: PlaylistGetManyOuput;
}

export function PlaylistSection({ playlist }: PlaylistSectionProps) {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <h2 className="text-xl font-medium">{playlist.title}</h2>
    </Link>
  );
}
