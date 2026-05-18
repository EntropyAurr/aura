"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/router/_app";
import { inferRouterOutputs } from "@trpc/server";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type Playlist = RouterOutput["songs"]["getMany"]["items"][number];

export interface MusicStreamingContextType {
  volume: number;
  isPlaying: boolean;
  duration: number | null;
  currentSongId: number | null;
  currentSongTime: number;
  progress: number;
  currentPlayedPlaylist: Playlist[];
  handleVolume: (value: number) => void;
  handlePlaySong: (id: number, listOfSongs?: Playlist[]) => void;
}

const defaultContext: MusicStreamingContextType = {
  volume: 15,
  isPlaying: false,
  duration: null,
  currentSongId: null,
  currentSongTime: 0,
  progress: 0,
  currentPlayedPlaylist: [],
  handleVolume: () => {},
  handlePlaySong: () => {},
};

export interface Song {
  songId: number;
  title: string;
  artist: string;
  song_url: string;
  duration: number;
}

export const MusicStreaming = createContext<MusicStreamingContextType>(defaultContext);

export function useMusicStreaming(): MusicStreamingContextType {
  const ctx = useContext(MusicStreaming);

  if (!ctx) throw new Error("useMusicStreaming must be used within MusicStreamingProvider");

  return ctx;
}

export default function MusicStreamingProvider({ children }: { children: React.ReactNode }) {
  const [playlists] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  );

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const songRef = useRef<Playlist | null>(null);

  const [volume, setVolume] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentPlayedPlaylist, setCurrentPlayedPlaylist] = useState<Playlist[]>([]);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [currentSongTime, setCurrentSongTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // VOLUME adjustment
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  function handleVolume(value: number) {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }

    setVolume(value);
  }

  // PLAY song
  const handlePlaySong = useCallback((id: number, listOfSongs?: Playlist[]) => {
    if (!listOfSongs) {
      console.log("No playlist available");
      return;
    }

    const song = listOfSongs.find((song) => song.songId === id);

    if (!song) return;

    if (!songRef.current || songRef.current.songId !== id) {
      if (!song.songs?.song_url) return;
      audioRef.current.src = song.songs.song_url;

      audioRef.current.currentTime = 0;
      setCurrentSongTime(0);
      setProgress(0);
    }

    songRef.current = song;
    setDuration(song.songs?.duration ?? null);
    setCurrentPlayedPlaylist(listOfSongs);

    audioRef.current.play().catch((error: Error) => {
      if (error.name !== "AbortError") {
        console.error("Playback failed:", error);
      }
    });

    setCurrentSongId(song.songId);
    setIsPlaying(true);
  }, []);

  return <MusicStreaming.Provider value={{ volume, isPlaying, duration, currentSongId, currentSongTime, progress, currentPlayedPlaylist, handleVolume, handlePlaySong }}>{children}</MusicStreaming.Provider>;
}
