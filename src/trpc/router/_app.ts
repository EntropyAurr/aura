import { playlistsRouter } from "@/modules/playlist/server/procedures";
import { createTRPCRouter } from "../init";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  playlists: playlistsRouter,
});

export type AppRouter = typeof appRouter;
