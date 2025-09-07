import { Metadata } from "next";
import Image from "next/image";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import logo from "../../../public/logo.png";

export const metadata: Metadata = {
  title: "Privacy Policy — LeadMate",
  description:
    "LeadMate&apos;s privacy policy outlines how we collect, use, and protect your business and customer data. We are committed to transparency and data protection.",
  openGraph: {
    title: "Privacy Policy — LeadMate",
    description:
      "LeadMate&apos;s privacy policy outlines how we collect, use, and protect your business and customer data.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-8">
            <Image src={logo} alt="LeadMate" height={80} width={120} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-main">Privacy</span> Policy
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground px-4">
            Your privacy and data security are our top priorities.
          </p>
          <p className="mt-4 text-foreground">
            <strong>Last updated:</strong> January 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Introduction</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                At LeadMate, we respect your privacy and are committed to
                protecting your personal data. This privacy policy explains how
                we collect, use, and safeguard your information when you use our
                AI-powered WhatsApp customer support service.
              </p>
              <p>
                By using LeadMate, you agree to the collection and use of
                information in accordance with this policy. If you have any
                questions about this Privacy Policy, please contact us at
                <strong className="text-white"> support@leadmate.ai</strong>.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <Eye className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Information We Collect
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Email address (for account creation and communication)
                  </li>
                  <li>Business name and contact information</li>
                  <li>WhatsApp Business account details</li>
                  <li>Billing and payment information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Usage Data
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Messages processed through our AI system</li>
                  <li>Service usage statistics and performance metrics</li>
                  <li>Device information and IP addresses</li>
                  <li>Log files and analytics data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Customer Conversation Data
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>WhatsApp messages between you and your customers</li>
                  <li>Customer contact information shared in conversations</li>
                  <li>AI-generated responses and conversation history</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                How We Use Your Information
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed">
              <p className="mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Service Delivery:</strong> To
                  provide and maintain our AI-powered WhatsApp support service
                </li>
                <li>
                  <strong className="text-white">Customer Support:</strong> To
                  respond to your questions and provide technical assistance
                </li>
                <li>
                  <strong className="text-white">Service Improvement:</strong>{" "}
                  To analyze usage patterns and improve our AI algorithms
                </li>
                <li>
                  <strong className="text-white">Communication:</strong> To send
                  you service updates, security alerts, and support messages
                </li>
                <li>
                  <strong className="text-white">Billing:</strong> To process
                  payments and manage your subscription
                </li>
                <li>
                  <strong className="text-white">Legal Compliance:</strong> To
                  comply with applicable laws and regulations
                </li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <Lock className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Data Protection & Security
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure data centers with physical and network security</li>
                <li>Employee training on data protection best practices</li>
              </ul>
              <p>
                However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your data, we cannot
                guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Data Sharing</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                <strong className="text-white">
                  We do not sell, trade, or rent your personal information to
                  third parties.
                </strong>
                We may share your information only in the following limited
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Service Providers:</strong>{" "}
                  With trusted third-party services that help us operate our
                  platform (cloud hosting, payment processing)
                </li>
                <li>
                  <strong className="text-white">Legal Requirements:</strong>{" "}
                  When required by law, court order, or to protect our rights
                  and safety
                </li>
                <li>
                  <strong className="text-white">Business Transfers:</strong> In
                  the event of a merger, acquisition, or sale of assets
                </li>
              </ul>
              <p>
                All third-party providers are contractually bound to protect
                your data and use it only for the purposes we specify.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Your Rights</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed">
              <p className="mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Access:</strong> Request a copy
                  of the personal data we hold about you
                </li>
                <li>
                  <strong className="text-white">Correction:</strong> Request
                  correction of inaccurate or incomplete data
                </li>
                <li>
                  <strong className="text-white">Deletion:</strong> Request
                  deletion of your personal data (subject to legal requirements)
                </li>
                <li>
                  <strong className="text-white">Portability:</strong> Request
                  transfer of your data to another service provider
                </li>
                <li>
                  <strong className="text-white">Opt-out:</strong> Unsubscribe
                  from marketing communications at any time
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                If you have any questions about this Privacy Policy or want to
                exercise your rights, please contact us at:
              </p>
              <div className="bg-dark-bg p-4 rounded-lg border border-gray-700">
                <p>
                  <strong className="text-white">Email:</strong>{" "}
                  support@leadmate.ai
                </p>
                <p>
                  <strong className="text-white">Subject:</strong> Privacy
                  Policy Inquiry
                </p>
              </div>
              <p>
                We will respond to your request within 30 days of receiving it.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className="bg-dark-card rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Policy Updates</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
              <p>
                We recommend reviewing this Privacy Policy periodically for any
                changes. Changes to this Privacy Policy are effective when they
                are posted on this page.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
