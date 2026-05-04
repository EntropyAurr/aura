import supabase from "@/services/supabase";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const playlistsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ title: z.string() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const { data: playlist, error } = await supabase.from("playlists").insert({ title: input.title, userId }).select().single();

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return { playlist };
  }),

  update: protectedProcedure.input(z.object({ id: z.number(), title: z.string() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "playlistId is not found" });
    }

    const { data: updatedPlaylist, error } = await supabase.from("playlists").update({ title: input.title, updated_at: new Date().toISOString() }).eq("id", input.id).eq("userId", userId).select().single();

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return updatedPlaylist;
  }),

  remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "playlistId is not found" });
    }

    const { data: removedPlaylist, error } = await supabase.from("playlists").delete().eq("id", input.id).eq("userId", userId);

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return removedPlaylist;
  }),

  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const { data: playlist, error } = await supabase.from("playlists").select().eq("id", input.id).eq("userId", userId).single();

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist is not found" });
    }

    return playlist;
  }),

  getMany: protectedProcedure.input(z.object({ cursor: z.object({ id: z.number(), updated_at: z.string() }).nullish(), limit: z.number().min(1).max(100) })).query(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    const { cursor, limit } = input;

    let query = supabase
      .from("playlists")
      .select()
      .eq("userId", userId)
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
