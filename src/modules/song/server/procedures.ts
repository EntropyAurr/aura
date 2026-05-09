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
      const { error: storageError } = await supabase.storage.from("songs").upload(songUrl, input.song_url);

      if (storageError) {
        throw new Error("Song URL could not be found");
      }
    }

    // Link song and playlist
    const { error: linkError } = await supabase.from("psRelations").insert([{ songId: song.id, playlistId: song.playlistId }]);

    if (linkError) throw new Error("There was an error while linking song and playlist");

    return song;
  }),

  remove: protectedProcedure.input(z.object({ songId: z.number(), playlistId: z.number() })).mutation(async ({ input }) => {
    const { songId, playlistId } = input;

    if (!songId) throw new TRPCError({ code: "BAD_REQUEST", message: "songId could not be found" });

    if (!playlistId) throw new TRPCError({ code: "BAD_REQUEST", message: "playlistId could not be found" });

    const { data: removedSong, error } = await supabase.from("psRelations").delete().match({ songId: songId, playlistId: playlistId });

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return removedSong;
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "songId could not be found" });
    }

    // 1. Get the song row to know the file path
    const { data: song, error: fetchError } = await supabase.from("songs").select("song_url").eq("id", input.id);

    if (fetchError) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Could not fetch song before deleting" });
    }

    let urlToDelete = song[0]?.song_url;

    if (song[0].song_url?.startsWith(supabaseUrl)) {
      urlToDelete = song[0].song_url.split("/storage/v1/object/public/songs/")[1];
    }

    // 2. Remove related playlist entries first
    const { error: relationError } = await supabase.from("psRelations").delete().eq("songId", input.id);

    if (relationError) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to remove song from playlist" });
    }

    // 3. Delete the song itself
    const { error: deleteError } = await supabase.from("songs").delete().eq("id", input.id);

    if (deleteError) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Song could not be deleted" });
    }

    // 4. Delete song from storage bucket
    if (urlToDelete) {
      const { error: storageError } = await supabase.storage.from("songs").remove([urlToDelete]);

      if (storageError) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to delete file from storage" });
      }
    }
  }),

  getMany: protectedProcedure.input(z.object({ id: z.number(), cursor: z.object({ id: z.number(), updated_at: z.string() }).nullish(), limit: z.number().min(1).max(100) })).query(async ({ input }) => {
    const { cursor, limit, id: playlistId } = input;

    let query = supabase
      .from("psRelations")
      .select("psId:id, created_at, updated_at, playlistId, songId, songs(title, artist, duration, song_url)")
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
          id: lastItem.psId,
          updated_at: lastItem.updated_at ?? new Date().toISOString(),
        }
      : null;

    return { items: trimmed, nextCursor };
  }),
});
