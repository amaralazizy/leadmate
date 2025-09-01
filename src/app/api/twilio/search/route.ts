import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  try {
    const { country } = await req.json();

    if (!country) {
      return NextResponse.json(
        { error: "country is required (e.g., 'US', 'EG', 'AE')" },
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

    const numbers = await client
      .availablePhoneNumbers(country)
      .local.list({ smsEnabled: true, limit: 20 });

    const results = numbers.map((n) => ({
      phoneNumber: n.phoneNumber,
      friendlyName: n.friendlyName,
      isoCountry: n.isoCountry,
      capabilities: n.capabilities,
    }));

    return NextResponse.json({ numbers: results });
  } catch (err) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
