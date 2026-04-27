import { PlaylistLayout } from "@/modules/playlist/layouts/playlist-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  <PlaylistLayout>{children}</PlaylistLayout>;
}
