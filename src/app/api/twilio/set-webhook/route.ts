import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  try {
    const { phoneSid, webhookUrl } = await req.json();
    if (!phoneSid || !webhookUrl) {
      return NextResponse.json(
        { error: "phoneSid and webhookUrl are required" },
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

    const client = twilio(accountSid, authToken);

    const updated = await client.incomingPhoneNumbers(phoneSid).update({
      smsUrl: webhookUrl,
    });

    return NextResponse.json({ success: true, sid: updated.sid });
  } catch (err) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
