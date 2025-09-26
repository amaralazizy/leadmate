import { Metadata } from "next";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Terms of Service — LeadMate",
  description:
    "LeadMate&apos;s terms of service outline the acceptable use of our AI-powered WhatsApp customer support platform. Read our terms and conditions.",
  openGraph: {
    title: "Terms of Service — LeadMate",
    description:
      "LeadMate&apos;s terms of service outline the acceptable use of our AI-powered WhatsApp customer support platform.",
    images: ["/og-image.png"],
  },
};

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-main">Terms</span> of Service
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground px-4">
            Fair and transparent terms for using LeadMate&apos;s services.
          </p>
          <p className="mt-4 text-foreground">
            <strong>Last updated:</strong> January 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Agreement */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Agreement to Terms
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                By accessing and using LeadMate&apos;s AI-powered WhatsApp
                customer support service, you agree to be bound by these Terms
                of Service (&quot;Terms&quot;). If you disagree with any part of
                these terms, you may not access the service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you
                (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and
                LeadMate (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;).
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Service Description
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                LeadMate provides an AI-powered customer support platform that
                integrates with WhatsApp to help businesses provide intelligent,
                automated responses to customer inquiries.
              </p>
              <p>Our service includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered message analysis and response generation</li>
                <li>WhatsApp Business API integration</li>
                <li>Customer conversation management tools</li>
                <li>Analytics and reporting features</li>
                <li>Customer support and technical assistance</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Acceptable Use Policy
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Permitted Uses
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Providing customer support and assistance to your legitimate
                    customers
                  </li>
                  <li>Answering product or service inquiries</li>
                  <li>Managing customer relationships and communication</li>
                  <li>Processing customer orders and requests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Prohibited Uses
                </h3>
                <p className="mb-3">You agree NOT to use LeadMate for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-white">
                      Spam or bulk messaging:
                    </strong>{" "}
                    Sending unsolicited messages to users who haven&apos;t
                    initiated contact
                  </li>
                  <li>
                    <strong className="text-white">Abusive content:</strong>{" "}
                    Harassment, threats, or inappropriate content
                  </li>
                  <li>
                    <strong className="text-white">Illegal activities:</strong>{" "}
                    Any unlawful business practices or communications
                  </li>
                  <li>
                    <strong className="text-white">Misrepresentation:</strong>{" "}
                    Impersonating other businesses or individuals
                  </li>
                  <li>
                    <strong className="text-white">System abuse:</strong>{" "}
                    Attempting to hack, disrupt, or reverse-engineer our service
                  </li>
                  <li>
                    <strong className="text-white">Competing services:</strong>{" "}
                    Using our platform to build competing AI services
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Responsibilities */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Account Responsibilities
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account credentials</li>
                <li>
                  Ensuring your WhatsApp Business account complies with
                  Meta&apos;s policies
                </li>
                <li>
                  Monitoring and reviewing AI-generated responses before they
                  are sent
                </li>
                <li>
                  Providing accurate business information and contact details
                </li>
                <li>Paying subscription fees on time</li>
                <li>
                  Promptly notifying us of any unauthorized use of your account
                </li>
              </ul>
            </div>
          </section>

          {/* Service Availability */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Service Availability
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                While we strive to provide 99.9% uptime, we cannot guarantee
                uninterrupted service. LeadMate may experience downtime due to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scheduled maintenance and updates</li>
                <li>
                  Third-party service dependencies (WhatsApp, cloud providers)
                </li>
                <li>Technical issues beyond our control</li>
                <li>Force majeure events</li>
              </ul>
              <p>
                We will provide advance notice of scheduled maintenance when
                possible and work to minimize service disruptions.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Limitation of Liability
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                <strong className="text-white">Disclaimer:</strong> LeadMate is
                provided &quot;as is&quot; without warranties of any kind. We do
                not guarantee that AI-generated responses will be error-free or
                appropriate for all situations.
              </p>
              <p>
                To the maximum extent permitted by law, LeadMate shall not be
                liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>
                  Damages resulting from third-party services (WhatsApp, etc.)
                </li>
                <li>User-generated content or inappropriate AI responses</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount paid by you for
                the service in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Termination</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>Either party may terminate this agreement:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">By you:</strong> At any time by
                  canceling your subscription
                </li>
                <li>
                  <strong className="text-white">By us:</strong> For violation
                  of these Terms or non-payment
                </li>
                <li>
                  <strong className="text-white">By us:</strong> With 30
                  days&apos; notice for any reason
                </li>
              </ul>
              <p>Upon termination:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Your access to the service will be suspended immediately
                </li>
                <li>You remain responsible for any outstanding fees</li>
                <li>
                  We will retain your data for 30 days for potential recovery
                </li>
                <li>After 30 days, your data will be permanently deleted</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Governing Law</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction where LeadMate is
                incorporated, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or the use of our service
                shall be resolved through binding arbitration in accordance with
                applicable arbitration rules.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-dark-bg p-4 rounded-lg border border-gray-700">
                <p>
                  <strong className="text-white">Email:</strong>{" "}
                  sherifelamir2003@gmail.com
                </p>
                <p>
                  <strong className="text-white">Subject:</strong> Terms of
                  Service Inquiry
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="bg-dark-card rounded-2xl p-8 border border-border">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-main mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Changes to Terms
              </h2>
            </div>
            <div className="text-foreground text-lg leading-relaxed space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify users of significant changes via email or through our
                service.
              </p>
              <p>
                Continued use of LeadMate after changes are made constitutes
                acceptance of the new Terms. If you disagree with the changes,
                you may terminate your account.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
