import { Metadata } from "next";
import { wisp } from "@/lib/wisp";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "WhatsApp Business & AI Customer Support Blog",
  description:
    "Expert tips, guides, and insights on WhatsApp business automation, AI customer support, lead generation, and small business growth strategies. Stay updated with the latest trends.",
  keywords: [
    "WhatsApp business blog",
    "AI customer support tips",
    "WhatsApp automation guides",
    "business growth",
    "customer service automation",
    "WhatsApp marketing strategies",
    "lead generation tips",
    "business messaging best practices",
    "AI chatbot tutorials",
    "customer engagement strategies",
  ],
  openGraph: {
    title: "WhatsApp Business & AI Customer Support Blog | LeadMate",
    description:
      "Expert tips and guides on WhatsApp automation, AI customer support, and small business growth. Learn how to scale your customer service with AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeadMate Blog - WhatsApp AI Customer Support Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Business & AI Customer Support Blog | LeadMate",
    description:
      "Expert tips and guides on WhatsApp automation, AI customer support, and small business growth.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.leadmate.app/blog",
    types: {
      "application/rss+xml": [
        {
          title: "LeadMate Blog RSS Feed",
          url: "https://www.leadmate.app/blog/rss.xml",
        },
      ],
    },
  },
};

export default async function BlogPage() {
  const result = await wisp.getPosts({ limit: 12 });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content?: string) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            WhatsApp Business <span className="text-main">Blog</span>
          </h1>
          <p className="mt-4 md:mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground">
            Expert insights, practical guides, and proven strategies for
            WhatsApp automation, AI customer support, and small business growth.
          </p>
        </div>

        {/* Featured Posts */}
        {result.posts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Latest Articles
            </h2>

            {/* Featured Post */}
            <div className="mb-8">
              <article className="bg-dark-card rounded-2xl p-6 md:p-8 border border-border hover:border-main/50 transition-all duration-300 group">
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(
                        result.posts[0].publishedAt?.toString() ||
                          new Date().toString()
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime()}</span>
                  </div>
                  {result.posts[0].tags && result.posts[0].tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <div className="flex gap-2">
                        {result.posts[0].tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="default"
                            className="bg-dark-bg text-main border-main/20"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link href={`/blog/${result.posts[0].slug}`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-main transition-colors">
                    {result.posts[0].title}
                  </h3>
                  {result.posts[0].description && (
                    <p className="text-foreground text-lg mb-6 leading-relaxed">
                      {result.posts[0].description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-main font-semibold group-hover:gap-3 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </article>
            </div>

            {/* Other Posts Grid */}
            {result.posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {result.posts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="bg-dark-card rounded-2xl p-6 border border-border hover:border-main/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(
                            post.publishedAt?.toString() ||
                              new Date().toString()
                          )}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getReadingTime()}</span>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="default"
                            className="bg-dark-bg text-main border-main/20 text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-main transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-main font-semibold group-hover:gap-3 transition-all text-sm">
                        <span>Read More</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* No Posts State */}
        {result.posts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-dark-card rounded-2xl p-8 border border-border max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                Coming Soon!
              </h2>
              <p className="text-foreground">
                We're working on creating amazing content about WhatsApp
                automation, AI customer support, and small business growth.
                Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-main/10 to-main/5 rounded-2xl p-8 border border-main/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-foreground text-lg mb-6 max-w-2xl mx-auto">
              Get the latest WhatsApp automation tips, AI customer support
              strategies, and business growth insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-text-light focus:outline-none focus:border-main transition-colors"
              />
              <button className="px-6 py-3 bg-main hover:bg-main/90 text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
