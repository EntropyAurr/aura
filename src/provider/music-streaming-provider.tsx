"use client";

import { AppRouter } from "@/trpc/router/_app";
import { inferRouterOutputs } from "@trpc/server";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type Playlist = RouterOutput["songs"]["getMany"]["items"][number];

export interface MusicStreamingContextType {
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isEnding: boolean;
  setIsEnding: React.Dispatch<React.SetStateAction<boolean>>;
  isLoopSong: boolean;
  setIsLoopSong: React.Dispatch<React.SetStateAction<boolean>>;
  songIndex: number | null;
  setSongIndex: React.Dispatch<React.SetStateAction<number>>;
  duration: number | null;
  currentSongId: number | null;
  currentSongTime: number;
  progress: number;
  currentPlayedPlaylist: Playlist[];
  handleVolume: (value: number) => void;
  handleProgressSong: (value: number) => void;
  handlePlaySong: (songId: number, playlist?: Playlist[]) => void;
  handlePauseSong: () => void;
  getCurrentSong: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  songRef: React.RefObject<Playlist | null>;
}

const defaultContext: MusicStreamingContextType = {
  volume: 15,
  setVolume: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  isEnding: false,
  setIsEnding: () => {},
  isLoopSong: false,
  setIsLoopSong: () => {},
  songIndex: null,
  setSongIndex: () => {},
  duration: null,
  currentSongId: null,
  currentSongTime: 0,
  progress: 0,
  currentPlayedPlaylist: [],
  handleVolume: () => {},
  handleProgressSong: () => {},
  handlePlaySong: () => {},
  handlePauseSong: () => {},
  getCurrentSong: () => {},
  audioRef: { current: null },
  songRef: { current: null },
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const songRef = useRef<Playlist | null>(null);

  const [volume, setVolume] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [isLoopSong, setIsLoopSong] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [songIndex, setSongIndex] = useState(-1);
  const [currentPlayedPlaylist, setCurrentPlayedPlaylist] = useState<Playlist[]>([]);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [currentSongTime, setCurrentSongTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  // VOLUME adjustment
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  function handleVolume(value: number) {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }

    setVolume(value);
  }

  // Get current song
  function getCurrentSong() {
    return currentPlayedPlaylist?.find((song) => song.songId === currentSongId)?.songs ?? songRef.current?.songs ?? null;
  }

  // PROGRESS of a song
  function handleProgressSong(value: number) {
    if (!duration) return;

    if (audioRef.current) {
      audioRef.current.currentTime = (value * duration) / 100;
    }

    setCurrentSongTime(value);
  }

  // PLAY song
  const handlePlaySong = useCallback((songId: number, playlist?: Playlist[]) => {
    if (!playlist) {
      console.log("No playlist available");
      return;
    }

    const song = playlist.find((song) => song.songId === songId);

    if (!song) return;

    const index = playlist.indexOf(song);

    // if no song is played or currently play a song and want to change to another song
    if (!songRef.current || songRef.current.songId !== songId) {
      if (!song.songs?.song_url) return;

      if (audioRef.current) {
        audioRef.current.src = song.songs.song_url;
        audioRef.current.currentTime = 0;
      }

      setCurrentSongTime(0);
      setProgress(0);
    }

    songRef.current = song;
    setDuration(song.songs?.duration ?? null);
    setCurrentPlayedPlaylist(playlist);

    audioRef.current?.play().catch((error: Error) => {
      if (error.name !== "AbortError") {
        console.error("Playback failed:", error);
      }
    });

    setIsEnding(false);
    setCurrentSongId(song.songId);
    setIsPlaying(true);
    setSongIndex(index);
  }, []);

  // PAUSE song
  function handlePauseSong() {
    if (audioRef.current) {
      setCurrentSongTime(audioRef.current.currentTime);
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }

  // NEXT song
  const handleNext = useCallback(() => {
    if (!currentPlayedPlaylist?.length || currentSongId === null) return;

    if (songIndex === -1) return;

    if (songIndex === currentPlayedPlaylist.length - 1) {
      setIsEnding(true);
      setIsPlaying(false);
      return;
    }

    const nextSong = currentPlayedPlaylist[songIndex + 1];

    if (nextSong?.songId != null) {
      handlePlaySong(nextSong.songId, currentPlayedPlaylist);
    }
  }, [songIndex, currentPlayedPlaylist, currentSongId, handlePlaySong]);

  useEffect(
    function () {
      const audio = audioRef.current;

      if (!audio) return;

      if (!songRef.current) return;

      function handleProgressUpdate() {
        if (!audioRef.current) return;

        if (!audioRef.current.duration) {
          setProgress(0);
          return;
        }

        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        setCurrentSongTime(audioRef.current.currentTime);
      }

      function handleEnded() {
        if (songIndex === -1) return;

        const song = currentPlayedPlaylist[songIndex];

        if (song.songId === null) return;

        if (!isLoopSong) {
          handleNext();
        } else {
          handlePlaySong(song.songId, currentPlayedPlaylist);
        }
      }

      audio.addEventListener("timeupdate", handleProgressUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleProgressUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    },
    [songIndex, currentPlayedPlaylist, handlePlaySong, handleNext, isLoopSong],
  );

  return <MusicStreaming.Provider value={{ volume, setVolume, isPlaying, setIsPlaying, isEnding, setIsEnding, isLoopSong, setIsLoopSong, duration, songIndex, setSongIndex, currentSongId, currentSongTime, progress, currentPlayedPlaylist, handleVolume, handleProgressSong, handlePlaySong, handlePauseSong, getCurrentSong, audioRef, songRef }}>{children}</MusicStreaming.Provider>;
}
