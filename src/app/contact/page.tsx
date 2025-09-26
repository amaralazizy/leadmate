"use client";

import { useState } from "react";
import { Mail, ClipboardList, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Note: This would normally be in a separate metadata file, but we're using a client component
// so we'll add the metadata in the layout or move this to a server component wrapper

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-main">Contact</span> Us
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground px-4">
            Get in touch with our team. We&apos;re here to help with any
            questions about LeadMate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-dark-card rounded-2xl p-8 border border-border">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-main mr-3" />
                <h2 className="text-2xl font-bold text-white">Get Support</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Email Support
                  </h3>
                  <p className="text-foreground mb-3">
                    For technical support, billing questions, or general
                    inquiries:
                  </p>
                  <div className="bg-dark-bg p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                    <p className="text-main font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                      {isCopied
                        ? "Email copied to clipboard"
                        : "sherifelamir2003@gmail.com"}
                    </p>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => {
                        setIsCopied(true);
                        navigator.clipboard.writeText(
                          "sherifelamir2003@gmail.com"
                        );
                        toast.success("Email copied to clipboard");
                        setTimeout(() => {
                          setIsCopied(false);
                        }, 2000);
                      }}
                    >
                      <ClipboardList />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Response Time
                  </h3>
                  <p className="text-foreground">
                    We typically respond to all inquiries within 24 hours during
                    business days. For urgent issues, please mark your email as
                    &quot;URGENT&quot; in the subject line.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Business Hours
                  </h3>
                  <p className="text-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM (UTC)
                    <br />
                    Weekend support for critical issues only
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div className="bg-dark-card rounded-2xl p-8 border border-border">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-8 w-8 text-main mr-3" />
                <h2 className="text-2xl font-bold text-white">Quick Links</h2>
              </div>
              <div className="space-y-4">
                <Link
                  href="/waitlist"
                  className="block p-4 rounded-lg border border-gray-700 hover:border-main transition-colors group"
                >
                  <h3 className="font-semibold text-white group-hover:text-main transition-colors">
                    Join the Waitlist
                  </h3>
                  <p className="text-foreground text-sm">
                    Be the first to try LeadMate when we launch
                  </p>
                </Link>

                <Link
                  href="/about"
                  className="block p-4 rounded-lg border border-gray-700 hover:border-main transition-colors group"
                >
                  <h3 className="font-semibold text-white group-hover:text-main transition-colors">
                    Learn About Us
                  </h3>
                  <p className="text-foreground text-sm">
                    Discover LeadMate&apos;s mission and values
                  </p>
                </Link>

                <Link
                  href="/privacy"
                  className="block p-4 rounded-lg border border-gray-700 hover:border-main transition-colors group"
                >
                  <h3 className="font-semibold text-white group-hover:text-main transition-colors">
                    Privacy Policy
                  </h3>
                  <p className="text-foreground text-sm">
                    How we protect your data and privacy
                  </p>
                </Link>
              </div>
            </div> */}
          </div>

          {/* Contact Form */}
          <div className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <Send className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Send us a Message
              </h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-main mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-foreground mb-6">
                  Thank you for reaching out. We&apos;ll get back to you within
                  24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-main hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-text-light focus:outline-none focus:border-main transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-text-light focus:outline-none focus:border-main transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-text-light focus:outline-none focus:border-main transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-bold py-3 px-6 text-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-dark-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                When will LeadMate be available?
              </h3>
              <p className="text-foreground">
                We&apos;re currently in development and accepting waitlist
                signups. Join our waitlist to be notified as soon as we launch.
              </p>
            </div> */}

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-foreground">
                Yes! We&apos;ll offer a free trial period when we launch.
                Waitlist members will get early access and extended trial
                periods.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you support other messaging platforms?
              </h3>
              <p className="text-foreground">
                Currently, we&apos;re focused on WhatsApp Business API. We may
                expand to other platforms based on customer demand.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How do you ensure compliance?
              </h3>
              <p className="text-foreground">
                LeadMate is designed specifically for customer support, adhering
                to WhatsApp&apos;s business policies and data protection
                standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
