import { supabase } from "@/lib/services/supabase/client";
import { getErrorMessage } from "@/lib/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname;
    console.log(id);
    const { error } = await supabase.from("leads").select("*").eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Lead created successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

