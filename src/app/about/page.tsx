import { Metadata } from "next";
import Image from "next/image";
import { MessageSquare, Target, Shield, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import logo from "../../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";

export const metadata: Metadata = {
  title: "About LeadMate — AI-Powered WhatsApp Solutions",
  description:
    "Learn about LeadMate's mission to help businesses provide better customer support through AI-powered WhatsApp conversations. Secure, compliant, and designed for growth.",
  openGraph: {
    title: "About LeadMate — AI-Powered WhatsApp Solutions",
    description:
      "Learn about LeadMate's mission to help businesses provide better customer support through AI-powered WhatsApp conversations.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-6 md:mb-8">
            <Image
              src={logo}
              alt="LeadMate"
              height={80}
              width={120}
              className="h-16 w-auto md:h-20"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            About <span className="text-main">LeadMate</span>
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground px-4">
            Making customer communication simple, reliable, and human-like.
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-16">
          <div className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Our Story</h2>
            </div>
            <div className="space-y-6 text-foreground text-lg leading-relaxed">
              <p>
                LeadMate was born from a simple observation: businesses of all
                sizes struggle to provide timely, consistent customer support on
                WhatsApp, the world&apos;s most popular messaging platform.
              </p>
              <p>
                Small and medium businesses often miss opportunities because
                they can&apos;t respond to customer inquiries instantly.
                Traditional solutions are either too complex, too expensive, or
                designed for enterprises rather than growing businesses.
              </p>
              <p>
                We created LeadMate to bridge this gap — offering intelligent,
                AI-powered assistance that understands your business and
                provides authentic, helpful responses to your customers, anytime
                they reach out.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <div className="space-y-6 text-foreground text-lg leading-relaxed">
              <p>
                Our mission is to empower every business with intelligent
                customer engagement tools that feel natural, reliable, and
                genuinely helpful.
              </p>
              <p>
                We believe that great customer service shouldn&apos;t be limited
                to large corporations with extensive resources. Every business
                deserves the ability to provide instant, professional responses
                that help customers and drive growth.
              </p>
              <p>
                LeadMate focuses specifically on customer support, not marketing
                automation. We&apos;re committed to helping businesses build
                genuine relationships with their customers through thoughtful,
                contextual conversations.
              </p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-card rounded-2xl p-6 border border-border">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-main mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Compliance First
                </h3>
              </div>
              <p className="text-foreground">
                We strictly adhere to WhatsApp&apos;s business policies and data
                protection standards. LeadMate is designed for legitimate
                customer support, not mass messaging or spam.
              </p>
            </div>

            <div className="bg-dark-card rounded-2xl p-6 border border-border">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-main mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Human-Centered
                </h3>
              </div>
              <p className="text-foreground">
                Our AI enhances human connection, not replaces it. Every
                response is designed to feel authentic and helpful, maintaining
                the personal touch your customers expect.
              </p>
            </div>

            <div className="bg-dark-card rounded-2xl p-6 border border-border">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-main mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Purpose-Built
                </h3>
              </div>
              <p className="text-foreground">
                Unlike generic chatbots, LeadMate is specifically designed for
                customer support scenarios. We understand the nuances of helping
                customers, not just answering questions.
              </p>
            </div>

            <div className="bg-dark-card rounded-2xl p-6 border border-border">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-main mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Privacy Focused
                </h3>
              </div>
              <p className="text-foreground">
                Your business data and customer conversations are protected with
                enterprise-grade security. We never share or sell your
                information.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-dark-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-foreground text-lg mb-6">
              Join us to be among the first to experience LeadMate&apos;s
              intelligent customer engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationButton
                href="/contact"
                className="font-bold py-3 px-6 text-lg"
              >
                Contact Us
              </NavigationButton>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
