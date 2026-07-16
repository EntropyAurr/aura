"use client";

import { TogglePlay } from "@/components/play-toggle";
import { ToggleVolume } from "@/components/volume-toggle";
import { useMusicStreaming } from "@/provider/music-streaming-provider";
import { formatDuration } from "@/utils/helpers";

export function PlayerBar() {
  const { volume, handleVolume, currentSongTime, duration, progress, handleProgressSong } = useMusicStreaming();

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-center gap-4 px-3 pr-5 shadow-md">
      <TogglePlay />

      <div className="flex items-center gap-2.5">
        <span className="min-w-16 text-center text-lg">{formatDuration(Number(currentSongTime))}</span>
        <input className="w-77 rounded-full" type="range" value={progress} min={0} max={100} step={0.1} onChange={(e) => handleProgressSong(Number(e.target.value))} />
        <span className="min-w-16 text-center text-lg">{formatDuration(Number(duration))}</span>
      </div>

      <div className="group relative flex items-center gap-4">
        <ToggleVolume />
        <input type="range" min={0} max={100} value={volume} onChange={(e) => handleVolume(Number(e.target.value))} className="w-0 rounded-full opacity-0 transition-all duration-300 ease-out group-hover:w-27 group-hover:opacity-100" />
      </div>
    </div>
  );
}
