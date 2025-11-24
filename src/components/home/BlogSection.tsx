"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { Author } from "@wisp-cms/client";

export interface BlogPost {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  image: string | null;
  authorId: string;
  author: Author;
  publishedAt: Date | null;
  createdAt: Date;
  content?: string;
  tags?: Array<{ id: string; name: string }>;
}

interface BlogSectionProps {
  posts?: BlogPost[];
}

export default function BlogSection({ posts = [] }: BlogSectionProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(posts);
  const [isLoading, setIsLoading] = useState(posts.length === 0);

  const formatDate = (date: Date | null) => {
    if (!date) return "Recent";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  // Show placeholder content if no posts yet
  const showPlaceholder = !isLoading && blogPosts.length === 0;

  return (
    <AnimatedSection className="py-24">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-main" />
          <span className="text-main font-semibold text-sm tracking-wide uppercase">
            Knowledge Hub
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          Latest from Our <span className="text-main">Blog</span>
        </h2>
        <p className="text-lg md:text-xl text-foreground max-w-4xl mx-auto">
          Expert insights, practical guides, and proven strategies for WhatsApp
          automation, AI customer support, and small business growth.
        </p>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-dark-card rounded-2xl p-6 border border-border animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded mb-4 w-24"></div>
              <div className="h-6 bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : showPlaceholder ? (
        // Placeholder content when no posts exist
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {[
            {
              title: "How to Set Up WhatsApp Business API for Small Businesses",
              description:
                "A comprehensive guide to getting started with WhatsApp Business API, from setup to first automated response.",
              readTime: "8 min",
              tag: "Getting Started",
            },
            {
              title:
                "5 Ways AI Can Improve Your Customer Support Response Time",
              description:
                "Discover proven strategies to reduce response times and increase customer satisfaction with AI automation.",
              readTime: "6 min",
              tag: "AI Tips",
            },
            {
              title: "Complete Guide to Lead Capture on WhatsApp",
              description:
                "Learn how to automatically capture and qualify leads from your WhatsApp conversations.",
              readTime: "10 min",
              tag: "Lead Generation",
            },
          ].map((post, index) => (
            <article
              key={index}
              className="bg-dark-card rounded-2xl p-6 border border-border opacity-60"
            >
              <Badge
                variant="neutral"
                className="bg-dark-bg text-main border-main/20 mb-4 text-xs px-2.5 py-0.5"
              >
                {post.tag}
              </Badge>
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-foreground mb-4 text-base leading-relaxed line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Coming Soon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        // Actual blog posts
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {blogPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-dark-card rounded-2xl p-6 border border-border hover:border-main/50 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{getReadingTime(post.content)}</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <Badge
                  variant="neutral"
                  className="bg-dark-bg text-main border-main/20 text-xs px-2.5 py-0.5 mb-4 w-fit"
                >
                  {post.tags[0].name}
                </Badge>
              )}

              <Link href={`/blog/${post.slug}`} className="block flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-main transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-foreground/80 mb-4 text-base leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                )}
              </Link>

              <div className="mt-auto pt-4">
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-main font-bold group-hover:gap-3 transition-all text-sm">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CTA to Blog */}
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card border border-main/20 hover:border-main text-main hover:text-white font-bold rounded-xl text-base transition-all duration-300 group"
        >
          <span>View All Articles</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </AnimatedSection>
  );
}
