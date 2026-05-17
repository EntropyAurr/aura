"use client";

import FileInput from "@/components/file-input";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import supabase, { supabaseUrl } from "@/services/supabase";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({ id: z.number(), title: z.string(), artist: z.string(), song_url: z.string(), duration: z.number(), file: z.instanceof(File) });
type FormData = z.infer<typeof schema>;

interface SongCreateModalProps {
  open: boolean;
  onClose: () => void;
  playlistId: number;
}

export function SongCreateModal({ open, onClose, playlistId }: SongCreateModalProps) {
  const { register, handleSubmit, setValue, reset, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: playlistId,
    },
  });
  const { errors } = formState;

  const utils = trpc.useUtils();

  const createSong = trpc.songs.create.useMutation({
    onSuccess: () => {
      toast.success("Song successfully created!");
      utils.songs.getMany.invalidate();

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

    setValue("song_url", selectedFile.name);
    setValue("file", selectedFile);

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(selectedFile);

    audio.addEventListener("loadedmetadata", () => {
      const durationInSeconds = Math.floor(audio.duration);

      setValue("duration", durationInSeconds);
    });
  }

  async function onSubmit(data: FormData) {
    const file = data.file as File;
    const songTitle = file.name.replaceAll(/[^\w.-]/g, "_");
    const { error } = await supabase.storage.from("songs").upload(songTitle, file);

    if (error) throw new Error(error.message);

    const songUrl = `${supabaseUrl}/storage/v1/object/public/songs/${songTitle}`;

    createSong.mutate({ ...data, song_url: songUrl });
  }                                                                                                                                                                       
  return (
    <ResponsiveModal title="Create a song" open={open} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Field>
            <Input {...register("title", { required: "This field is required" })} placeholder="Song title" />
            <FieldError>{errors.title?.message && "TITLE ERROR"}</FieldError>
          </Field>

          <Field>
            <Input {...register("artist", { required: "This field is required" })} placeholder="Artist" />
            <FieldError>{errors.artist?.message && "ARTIST ERROR"}</FieldError>
          </Field>

          <Field>
            <Input type="hidden" {...register("duration")} />
          </Field>

          <Field>
            <FileInput accept="audio/*" onChange={(e) => handleFileInput(e)} />
            <FieldError>{errors.song_url?.message && "URL ERROR"}</FieldError>
          </Field>

          <Button type="submit">Create song</Button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
