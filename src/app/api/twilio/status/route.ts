import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { senderSid } = await req.json();
    if (!senderSid) {
      return NextResponse.json(
        { error: "senderSid required" },
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

    const resp = await fetch(
      `https://messaging.twilio.com/v2/Channels/Senders/${senderSid}`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        },
      }
    );
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data?.message || "Twilio error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: data.status,
      properties: data.properties,
      data,
    });
  } catch (err) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
