import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // Build query with filters
    let query = supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    const { data: leads, error } = await query;

    if (error) {
      throw error;
    }

    // Convert to CSV format with enhanced lead information
    const csvHeaders = [
      "Date Created",
      "Customer Name",
      "Customer Phone",
      "Email",
      "Lead Type",
      "Status",
      "Urgency",
      "Location",
      "Company",
      "Budget",
      "Preferences",
      "Details",
    ];

    const csvRows =
      leads?.map((lead) => {
        // Parse details to extract structured information
        const details = lead.details || "";
        const extractEmail =
          details.match(/Email:\s*([^\n]+)/)?.[1]?.trim() || "";
        const extractLocation =
          details.match(/Location:\s*([^\n]+)/)?.[1]?.trim() || "";
        const extractCompany =
          details.match(/Company:\s*([^\n]+)/)?.[1]?.trim() || "";
        const extractBudget =
          details.match(/Budget:\s*([^\n]+)/)?.[1]?.trim() || "";
        const extractPreferences =
          details.match(/Preferences:\s*([^\n]+)/)?.[1]?.trim() || "";
        const extractUrgency =
          details.match(/Urgency:\s*([^\n]+)/)?.[1]?.trim() || "";

        // Clean details by removing the structured parts we've extracted

        const cleanDetails = details
          .replace(/Email:\s*[^\n]+\n?/g, "")
          .replace(/Location:\s*[^\n]+\n?/g, "")
          .replace(/Company:\s*[^\n]+\n?/g, "")
          .replace(/Budget:\s*[^\n]+\n?/g, "")
          .replace(/Preferences:\s*[^\n]+\n?/g, "")
          .replace(/Urgency:\s*[^\n]+\n?/g, "")
          .trim();

        // Ensure phone number has + prefix and format it properly for Excel
        // Add a space after + to prevent Excel from treating it as a formula
        const formattedPhone = lead.customer_phone.startsWith("+")
          ? lead.customer_phone
          : `+${lead.customer_phone}`;

        return [
          new Date(lead.created_at).toLocaleDateString(),
          lead.customer_name,
          formattedPhone,
          extractEmail,
          lead.type,
          lead.status,
          extractUrgency,
          extractLocation,
          extractCompany,
          extractBudget,
          extractPreferences,
          cleanDetails || "No additional details",
        ];
      }) || [];

    // Create CSV content with UTF-8 BOM for proper encoding
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Add UTF-8 BOM (Byte Order Mark) for proper character encoding in Excel
    const utf8BOM = "\uFEFF";
    const csvWithBOM = utf8BOM + csvContent;

    // Return CSV file with proper encoding
    return new Response(csvWithBOM, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
