"use client";

import { useMusicStreaming } from "@/provider/music-streaming-provider";
import { useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function ToggleVolume() {
  const { audioRef, volume, setVolume } = useMusicStreaming();

  const [isMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume / 100);

  function handleToggle() {
    const audio = audioRef.current;

    if (!audio) return;

    if (isMuted || audio.volume === 0) {
      audio.volume = prevVolume;
      setVolume(Math.floor(prevVolume * 100));
    } else {
      setPrevVolume(audio.volume);
      audio.volume = 0;
      setVolume(0);
    }
  }

  return (
    <Button onClick={handleToggle} size="lg">
      {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
    </Button>
  );
}
