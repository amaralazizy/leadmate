// import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  const twiml = new twilio.twiml.MessagingResponse();
  const body = await req.formData();

  const incomingMsg = body.get("Body") as string;

  let reply = "👋 Thanks for your message. We'll get back to you shortly.";
  if (incomingMsg?.toLowerCase().includes("hello")) {
    reply = "Hi! Your WhatsApp number is active.";
  }
  twiml.message(reply);

  return new Response(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
