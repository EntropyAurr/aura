"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileInput from "@/components/file-input";
import { toast } from "sonner";

const schema = z.object({ id: z.number(), title: z.string(), artist: z.string(), song_url: z.string(), duration: z.number() });
type FormData = z.infer<typeof schema>;

interface SongCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function SongCreateModal({ open, onClose }: SongCreateModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const utils = trpc.useUtils();

  const createSong = trpc.songs.create.useMutation({
    onSuccess: () => {
      toast.success("Song successfully created!");
      // utils.songs.getOne.invalidate();

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

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(selectedFile);

    audio.addEventListener("loadedmetadata", () => {
      const durationInSeconds = Math.floor(audio.duration);

      setValue("duration", durationInSeconds);
    });
  }

  return (
    <ResponsiveModal title="Create a song" open={open} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit((data) => createSong.mutate(data))}>
        <div className="flex flex-col gap-4">
          <Input {...register("title", { required: "This field is required" })} placeholder="Song title" />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}

          <Input {...register("artist", { required: "This field is required" })} placeholder="Artist" />
          {errors.artist && <p className="mt-1 text-sm text-red-500">{errors.artist.message}</p>}

          <Input type="hidden" {...register("duration")} />

          <FileInput {...register("song_url", { required: "This field is required" })} accept="audio/*" onChange={(e) => handleFileInput(e)} />
          {errors.song_url && <p className="mt-1 text-sm text-red-500">{errors.song_url.message}</p>}

          <Button type="submit">Create song</Button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
