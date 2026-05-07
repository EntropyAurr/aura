import supabase, { supabaseUrl } from "@/services/supabase";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const songsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ id: z.number(), title: z.string(), artist: z.string(), song_url: z.string(), duration: z.number() })).mutation(async ({ input }) => {
    const hasSongUrl = input.song_url?.startsWith?.(supabaseUrl);
    const songTitle = `${input.song_url}`.replaceAll(/[^\w.-]/g, "_");
    const songUrl = hasSongUrl ? input.song_url : `${supabaseUrl}/storage/v1/object/public/songs/${songTitle}`;

    const { data: song, error } = await supabase.from("songs").insert({ playlistId: input.id, title: input.title, artist: input.artist, song_url: songUrl, duration: input.duration }).select().single();

    if (error) {
      console.log(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    if (!hasSongUrl) {
      const { error: storageError } = await supabase.storage.from("songs").upload(songTitle, input.song_url);

      if (storageError) {
        throw new Error("Song URL could not be found");
      }
    }

    console.log(song);

    return { song };
  }),

  getMany: protectedProcedure.input(z.object({ id: z.number(), cursor: z.object({ id: z.number(), updated_at: z.string() }).nullish(), limit: z.number().min(1).max(100) })).query(async ({ input }) => {
    const { cursor, limit, id: playlistId } = input;

    let query = supabase
      .from("songs")
      .select()
      .eq("playlistId", playlistId)
      .order("updated_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.or(`updated_at.lt.${cursor.updated_at},and(updated_at.eq.${cursor.updated_at},id.lt.${cursor.id})`);
    }

    const { data, error } = await query;

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    const items = data ?? [];
    const hasMore = items.length > limit;
    const trimmed = hasMore ? items.slice(0, -1) : items;
    const lastItem = trimmed[trimmed.length - 1];

    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updated_at: lastItem.updated_at ?? new Date().toISOString(),
        }
      : null;

    return { items: trimmed, nextCursor };
  }),
});

// https://auqnjrbjnjwflkcrbush.supabase.co/storage/v1/object/public/songs/-MAD-Missing%20You.mp3
// https://auqnjrbjnjwflkcrbush.supabase.co/storage/v1/object/public/songs/blob_http___localhost_8000_2447937d-9054-4b62-a4f4-6ed25a6a73a1
