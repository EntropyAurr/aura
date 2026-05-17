import { playlistsRouter } from "@/modules/playlist/server/procedures";
import { createTRPCRouter } from "../init";
import { usersRouter } from "./user";
import { songsRouter } from "@/modules/song/server/procedures";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  playlists: playlistsRouter,
  songs: songsRouter,
});

export type AppRouter = typeof appRouter;
