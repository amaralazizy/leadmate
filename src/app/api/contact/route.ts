import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/services/resend/resend";
import { z } from "zod";

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);
    const { name, email, message } = validatedData;

    // Send email to the business
    const { error: emailError } = await resend.emails.send({
      from: "LeadMate Contact <contact@leadmate.com>",
      to: "support@leadmate.com", // Replace with your actual support email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d;">
            <p>Reply to this email to respond directly to ${name} at ${email}</p>
          </div>
        </div>
      `,
      replyTo: email, // Allow direct reply to the sender
    });

    if (emailError) {
      console.error("Failed to send contact email:", emailError);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    const { error: confirmationError } = await resend.emails.send({
      from: "LeadMate <no-reply@leadmate.com>",
      to: email,
      subject: "Thank you for contacting LeadMate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Thank you for reaching out!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your message:</h3>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          
          <p>In the meantime, feel free to explore our platform and see how LeadMate can help transform your customer support with AI-powered WhatsApp conversations.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://leadmate.com"
            }" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Visit LeadMate
            </a>
          </div>
          
          <p>Best regards,<br>The LeadMate Team</p>
        </div>
      `,
    });

    // Don't fail the request if confirmation email fails
    if (confirmationError) {
      console.error("Failed to send confirmation email:", confirmationError);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Contact API endpoint is working" },
    { status: 200 }
  );
}
