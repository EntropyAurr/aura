import { PlaylistLayout } from "@/modules/playlist/ui/layouts/playlist-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <PlaylistLayout>{children}</PlaylistLayout>;
}
