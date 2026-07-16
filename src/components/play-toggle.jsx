"use client";

import { useEffect } from "react";
import { useMusicStreaming } from "@/provider/music-streaming-provider";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

export function TogglePlay() {
  const { audioRef, isPlaying, setIsPlaying, isEnding, setIsEnding, handlePlaySong, handlePauseSong, currentSongId, currentPlayedPlaylist } = useMusicStreaming();

  useEffect(function () {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsEnding(true);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  function handleToggle() {
    if (isEnding) {
      const firstSong = currentPlayedPlaylist[0];

      if (firstSong?.songId != null) {
        handlePlaySong(firstSong.songId, currentPlayedPlaylist);
        setIsEnding(false);
      }

      return;
    }

    if (isPlaying) {
      handlePauseSong();
      return;
    }

    if (currentSongId != null) {
      handlePlaySong(currentSongId, currentPlayedPlaylist);
    }
  }

  return (
    <Button size="lg" onClick={handleToggle}>
      {isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}
