interface PageProps {
  playlistId: number;
}

export function PlaylistView({ playlistId }: PageProps) {
  return <div className="max-w-screen-lg px-4 pt-2.5">{playlistId}</div>;
}
