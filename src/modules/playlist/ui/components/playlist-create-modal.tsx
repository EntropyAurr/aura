"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";

export function PlaylistCreateModal() {
  return (
    <>
      <ResponsiveModal title="Create a playlist"></ResponsiveModal>

      <Button variant="secondary">Create</Button>
    </>
  );
}
