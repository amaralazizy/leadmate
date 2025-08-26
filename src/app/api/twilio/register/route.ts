import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, phoneNumber, profile } = await req.json();
    if (!userId || !phoneNumber) {
      return NextResponse.json(
        { error: "userId and phoneNumber are required" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return NextResponse.json(
        { error: "Twilio credentials missing" },
        { status: 500 }
      );
    }

    // Using fetch since Senders API may not be in official SDK
    const resp = await fetch(
      "https://messaging.twilio.com/v2/Channels/Senders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        },
        body: JSON.stringify({
          sender_id: `whatsapp:${phoneNumber}`,
          profile: profile || {},
        }),
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data?.message || "Twilio error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sender: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
