import { headers } from "next/headers";
import { Webhook } from "svix";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

export async function POST(req) {
  const payload = await req.text();

  const headerPayload = headers();
  
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const wh = new Webhook(webhookSecret);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    await dbConnect();

    await User.create({
      fullName: data.username || data.first_name + " " + data.last_name || "User",
      email: data.email_addresses[0]?.email_address,
    });

    console.log(`✅ User ${data.email_addresses[0]?.email_address} added to MongoDB`);
  }

  return new Response("Webhook received", { status: 200 });
}
