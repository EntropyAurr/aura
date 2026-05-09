"use client";

import { RouterOutputs, trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, Plus, SquarePen, Trash2Icon, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type SongGetManyOutPut = RouterOutputs["songs"]["getMany"]["items"][number];

interface SongMenuProps {
  song: SongGetManyOutPut;
  variants?: "ghost" | "secondary";
}

export function SongMenu({ song, variants = "ghost" }: SongMenuProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const utils = trpc.useUtils();

  const removeSong = trpc.songs.remove.useMutation({
    onSuccess: () => {
      utils.songs.getMany.invalidate();

      toast.success("Song removed successfully from the playlist");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteSong = trpc.songs.delete.useMutation({
    onSuccess: () => {
      utils.songs.getMany.invalidate();

      toast.success("Song deleted successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variants} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => {}}>
          <SquarePen className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => {}}>
          <Plus className="size-4" />
          Add
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => removeSong.mutate({ songId: song.songId!, playlistId: song.playlistId! })}>
          <X className="size-4" />
          Remove
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete song</AlertDialogTitle>

            <AlertDialogDescription>This action cannot be undone!</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={() => deleteSong.mutate({ id: song.songId! })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
