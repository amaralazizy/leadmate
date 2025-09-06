"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-dark-card">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Get in Touch
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Have questions about our AI WhatsApp Bot? Want to learn more about
            how it can transform your business? We&apos;d love to hear from you!
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-dark-secondary rounded-2xl p-8 md:p-12 border-2 border-main shadow-[6px_6px_0px_0px_rgba(57,255,20,0.8)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-white font-semibold mb-3 text-lg"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border-2 border-2c2c2c rounded-lg text-white placeholder-text-light focus:border-main focus:outline-none transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-white font-semibold mb-3 text-lg"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark-bg border-2 border-2c2c2c rounded-lg text-white placeholder-text-light focus:border-main focus:outline-none transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-white font-semibold mb-3 text-lg"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-2c2c2c rounded-lg text-white placeholder-text-light focus:border-main focus:outline-none transition-all duration-300 resize-none"
                placeholder="Tell us about your business and how we can help..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-main text-dark-bg font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-400 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="text-center p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <p className="text-green-400 font-semibold">
                  ✅ Message sent successfully! We&apos;ll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="text-center p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400 font-semibold">
                  ❌ Something went wrong. Please try again or contact us
                  directly.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        {/* <div className="mt-12 text-center">
          <p className="text-foreground text-lg mb-4">
            Prefer to reach out directly?
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:amarelazizy@gmail.com"
              className="text-main hover:text-green-400 transition-colors duration-300 font-semibold"
            >
              amarelazizy@gmail.com
            </a>
            <span className="text-foreground hidden md:inline">•</span>
            <a
              href="mailto:sherifelamir2003@gmail.com"
              className="text-main hover:text-green-400 transition-colors duration-300 font-semibold"
            >
              sherifelamir2003@gmail.com
            </a>
          </div>
        </div> */}
      </div>
    </section>
  );
}
