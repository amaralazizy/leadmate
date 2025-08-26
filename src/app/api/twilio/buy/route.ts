import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, phoneNumber } = await req.json();
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

    const client = twilio(accountSid, authToken);

    const purchased = await client.incomingPhoneNumbers.create({
      phoneNumber,
    });

    //TODO: Check if the phone number is purchased before updating database
    await supabaseAdmin
      .from("users")
      .update({
        twilio_phone_sid: purchased.sid,
        twilio_phone_number: purchased.phoneNumber,
      })
      .eq("id", userId);

    return NextResponse.json({
      success: true,
      sid: purchased.sid,
      phoneNumber: purchased.phoneNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
