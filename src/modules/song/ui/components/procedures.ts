import supabase from "@/services/supabase";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const songsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ id: z.number(), title: z.string(), artist: z.string(), song_url: z.string(), duration: z.number() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const { data: song, error } = await supabase.from("songs").insert({ playlistId: input.id, title: input.title, artist: input.artist, song_url: input.song_url, duration: input.duration }).select().single();

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return { song };
  }),
});
