"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function PlayerBar() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-center border border-teal-400 px-3 pr-5 shadow-md">
      <Button variant="default" size="lg" onClick={() => {}}>
        <Play />
      </Button>
    </div>
  );
}
