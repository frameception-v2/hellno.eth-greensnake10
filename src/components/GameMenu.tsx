"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface GameMenuProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onRestart: () => void;
}

export function GameMenu({ isPaused, onPauseResume, onRestart }: GameMenuProps) {
  return (
    <div className="absolute right-2 top-2 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
          >
            ☰
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onPauseResume}
            className="cursor-pointer focus:bg-neutral-100/50 dark:focus:bg-neutral-800/50"
          >
            {isPaused ? "Resume Game" : "Pause Game"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRestart}
            className="cursor-pointer focus:bg-neutral-100/50 dark:focus:bg-neutral-800/50"
          >
            Restart Game
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
