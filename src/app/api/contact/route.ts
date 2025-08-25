import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get email addresses from environment variables or use defaults
    const email1 = process.env.CONTACT_EMAIL_1 || "amarelazizy@gmail.com";
    const email2 = process.env.CONTACT_EMAIL_2 || "sherifelamir2003@gmail.com";

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #39ff14; color: #000; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #39ff14; }
            .value { background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 5px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔥 New Contact Form Submission</h1>
            </div>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, "<br>")}</div>
            </div>
            
            <div class="footer">
              <p>This message was sent from your website contact form.</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails to both addresses
    const emailPromises = [
      resend.emails.send({
        from: "LeadMate <noreply@soar-ny.com>",
        to: email1,
        subject: `New Contact Form Submission from ${name}`,
        html: htmlContent,
        replyTo: email,
      }),
      resend.emails.send({
        from: "LeadMate <noreply@soar-ny.com>",
        to: email2,
        subject: `New Contact Form Submission from ${name}`,
        html: htmlContent,
        replyTo: email,
      }),
    ];

    // Wait for both emails to be sent
    const results = await Promise.allSettled(emailPromises);

    // Check if both emails were sent successfully
    const successfulEmails = results.filter(
      (result) => result.status === "fulfilled"
    ).length;

    if (successfulEmails === 2) {
      return NextResponse.json({
        message: "Contact form submitted successfully",
        emailsSent: 2,
      });
    } else {
      console.error("Some emails failed to send:", results);
      return NextResponse.json(
        {
          message:
            "Contact form submitted, but some notification emails failed",
          emailsSent: successfulEmails,
        },
        { status: 207 }
      ); // 207 Multi-Status
    }
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
