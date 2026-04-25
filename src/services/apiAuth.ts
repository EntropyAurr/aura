import supabase from "./supabase";

interface getCurrentUserProps {
  clerkId: string | null | undefined;
}

export async function getCurrentUser({ clerkId }: getCurrentUserProps) {
  if (!clerkId) {
    return null;
  }

  const { data, error } = await supabase.from("users").select("*").eq("clerkId", clerkId).single();

  if (error) throw new Error(error.message);

  return data;
}
