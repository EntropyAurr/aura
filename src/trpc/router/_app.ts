import { playlistsRouter } from "@/modules/playlist/server/procedures";
import { createTRPCRouter } from "../init";
import { userRouter } from "./user";
import { songsRouter } from "@/modules/song/server/procedures";

export const appRouter = createTRPCRouter({
  user: userRouter,
  playlists: playlistsRouter,
  songs: songsRouter,
});

export type AppRouter = typeof appRouter;
