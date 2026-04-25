"use client";

import { getCurrentUser } from "@/services/apiAuth";
import { useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const { user: clerkUser } = useClerk();

  const {
    isPending,
    data: user,
    fetchStatus,
  } = useQuery({
    queryKey: ["user", clerkUser?.id],
    queryFn: () => getCurrentUser({ clerkId: clerkUser?.id ?? "" }),
  });

  return { isPending, user, isAuthenticated: !!clerkUser, fetchStatus };
}
