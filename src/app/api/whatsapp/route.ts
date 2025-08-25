import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = "ACb30e2f1b22778215c72a3edf3b90192c";
const authToken = "e902e471a4c1c263a2b14563035d5811";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  const client = twilio(accountSid, authToken);

  try {
    const msg = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log(msg);

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
