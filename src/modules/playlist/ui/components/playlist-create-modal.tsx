"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({ title: z.string() });
type FormData = z.infer<typeof schema>;

interface PlaylistCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlaylistCreateModal({ open, onClose }: PlaylistCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const utils = trpc.useUtils();

  const createPlaylist = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist successfully created!");
      utils.playlists.getOne.invalidate();

      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <ResponsiveModal title="Create a playlist" open={open} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit((data) => createPlaylist.mutate(data))}>
        <div>
          <Input {...register("title")} placeholder="Playlist title" disabled={createPlaylist.isPending} />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <Button type="submit" variant="default" disabled={createPlaylist.isPending}>
          {createPlaylist.isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </ResponsiveModal>
  );
}
