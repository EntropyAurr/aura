"use client";

import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/features/users/useUser";

export default function Page() {
  const { user, isPending } = useUser();

  if (isPending) return <Spinner />;

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return <div>{JSON.stringify(user)}</div>;
}
