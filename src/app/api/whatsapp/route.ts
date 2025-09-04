import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  // const accountSid = process.env.TWILIO_ACCOUNT_SID;
  // const authToken = process.env.TWILIO_AUTH_TOKEN;
  //const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

  const whatsappFrom = "whatsapp:+14155238886";
  const accountSid = "ACb30e2f1b22778215c72a3edf3b90192c";
  const authToken = "f3e731126f32a6437269e240af5b8fea";

  if (!accountSid || !authToken || !whatsappFrom) {
    return NextResponse.json(
      {
        success: false,
        error: "Twilio environment variables are not configured",
      },
      { status: 500 }
    );
  }

  const client = twilio(accountSid, authToken);

  try {
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`,
      body: message,
    });

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (error) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) });
  }
}
