"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlaylistRenameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (title: string) => void;
  currentTitle: string;
  isPending?: boolean;
}

export function PlaylistRenameModal({ open, onOpenChange, onRename, currentTitle, isPending }: PlaylistRenameModalProps) {
  const [title, setTitle] = useState(currentTitle);

  function handleSubmit() {
    if (!title) return;

    onRename(title);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Playlist</DialogTitle>
        </DialogHeader>

        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Playlist name" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancle
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
