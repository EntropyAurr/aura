"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ListMusic, UserCircleIcon } from "lucide-react";

export function AuthButton() {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link label="Playlist" href="/playlist" labelIcon={<ListMusic className="size-4" />} />

            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" className="rounded-full border-teal-500/20 px-4 py-2 text-sm font-medium text-teal-600 shadow-none hover:text-teal-500">
            <UserCircleIcon />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
