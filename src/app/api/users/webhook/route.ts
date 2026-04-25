import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import supabase from "@/services/supabase";
import { UserJSON } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { data } = evt;
    const eventType = evt.type;
    const user = data as UserJSON;

    if (eventType === "user.created") {
      const { error } = await supabase
        .from("users")
        .insert([{ clerkId: user.id, name: `${user.first_name} ${user.last_name}`, imageUrl: user.image_url }])
        .select();

      if (error) {
        console.log(error);
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
