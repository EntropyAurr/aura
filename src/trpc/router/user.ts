import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";

export const usersRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from("users").select("*").eq("clerkId", ctx.clerkUserId!).single();

    if (error) throw new TRPCError({ code: "NOT_FOUND" });

    return data;
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        imageUrl: z.url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("users")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("clerkId", ctx.clerkUserId!)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return data;
    }),
});
