"use client";

import z from "zod";

const schema = z.object({ songId: z.number(), title: z.string(), artist: z.string(), song_url: z.string(), file: z.instanceof(File) });
type FormData = z.infer<typeof schema>;

interface SongEditModalProps {
  open: boolean;
  onClose: () => void;
  songId: number;
}

export function SongEditModal({ open, onClose, songId }: SongEditModalProps) {}
