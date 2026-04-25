import supabase from "./supabase";

interface getCurrentUserProps {
  clerkId: string;
}

export async function getCurrentUser({ clerkId }: getCurrentUserProps) {
  const { data, error } = await supabase.from("users").select("*").eq("clerkId", clerkId).single();

  if (error) throw new Error(error.message);

  return data;
}
