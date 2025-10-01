import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog Post Not Found | LeadMate",
  description:
    "The requested blog post could not be found. Browse our latest articles about WhatsApp automation and AI customer support.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogNotFound() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Navigation */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-main hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </nav>

        {/* 404 Content */}
        <div className="text-center py-16">
          <div className="bg-dark-card rounded-2xl p-8 md:p-12 border border-border max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-main/10 p-4 rounded-full">
                <FileText className="h-12 w-12 text-main" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Article Not Found
            </h1>

            <p className="text-foreground text-lg mb-8 leading-relaxed">
              Oops! The blog post you're looking for doesn't exist or may have
              been moved. Don't worry, we have plenty of other great content
              about WhatsApp automation and AI customer support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="font-semibold">
                <Link href="/blog">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Articles
                </Link>
              </Button>

              <Button
                variant="default"
                asChild
                className="border-gray-600 hover:border-main text-foreground hover:text-main bg-transparent"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Popular Topics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "WhatsApp Automation",
                description:
                  "Learn how to automate your WhatsApp customer support",
                icon: "🤖",
              },
              {
                title: "Lead Generation",
                description:
                  "Discover strategies to capture more leads from conversations",
                icon: "📈",
              },
              {
                title: "AI Customer Support",
                description:
                  "Transform your customer service with AI technology",
                icon: "💬",
              },
            ].map((topic, index) => (
              <Link
                key={index}
                href="/blog"
                className="bg-dark-card rounded-xl p-6 border border-border hover:border-main/50 transition-all duration-300 group"
              >
                <div className="text-2xl mb-3">{topic.icon}</div>
                <h3 className="text-lg font-semibold text-white group-hover:text-main transition-colors mb-2">
                  {topic.title}
                </h3>
                <p className="text-foreground text-sm">{topic.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
