import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
// import { supabaseAdmin } from "@/lib/services/supabase/server";
// import { supabase } from "@/lib/services/supabase/client";

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

    //TODO: check response of create endpoint for twilio

    // if (purchased.phoneNumber) {
    //   const { error } = await supabase
    //     .from("users")
    //     .update({ phoneNumber: purchased.phoneNumber })
    //     .eq("id", userId)
    //     .select();

    //   if (error) {
    //     return NextResponse.json({ error: error.message }, { status: 500 });
    //   }
    // }

    return NextResponse.json({
      success: true,
      sid: purchased.sid,
      phoneNumber: purchased.phoneNumber,
    });
  } catch (err) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
