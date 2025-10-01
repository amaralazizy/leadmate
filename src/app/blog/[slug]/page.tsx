import { Metadata } from "next";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Script from "next/script";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const result = await wisp.getPosts({ limit: 100 });

  return result.posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const result = await wisp.getPost(params.slug);

  if (!result || !result.post) {
    return {
      title: "Post Not Found | LeadMate Blog",
      description: "The requested blog post could not be found.",
    };
  }

  const { post } = result;
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt)
    : new Date();
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : publishedDate;

  return {
    title: `${post.title} | LeadMate Blog`,
    description:
      post.description ||
      "Read this insightful article about WhatsApp automation and AI customer support.",
    keywords: [
      ...(post.tags?.map((tag) => tag.name) || []),
      "WhatsApp automation",
      "AI customer support",
      "small business tips",
      "LeadMate",
      "business growth",
      "customer service automation",
    ],
    authors: [{ name: post.author?.name || "LeadMate Team" }],
    creator: post.author?.name || "LeadMate Team",
    publisher: "LeadMate",
    category: "Business Technology",
    openGraph: {
      title: post.title,
      description:
        post.description ||
        "Read this insightful article about WhatsApp automation and AI customer support.",
      images: [
        {
          url: post.image || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: publishedDate.toISOString(),
      modifiedTime: updatedDate.toISOString(),
      authors: [post.author?.name || "LeadMate Team"],
      section: "Technology",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description:
        post.description ||
        "Read this insightful article about WhatsApp automation and AI customer support.",
      images: [post.image || "/twitter-image.png"],
      creator: "@leadmate_app",
    },
    alternates: {
      canonical: `https://www.leadmate.app/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

// JSON-LD Structured Data Component
function BlogPostStructuredData({ post }: { post: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      post.description ||
      "Read this insightful article about WhatsApp automation and AI customer support.",
    image: post.image || "https://www.leadmate.app/og-image.png",
    author: {
      "@type": "Person",
      name: post.author?.name || "LeadMate Team",
      url: "https://www.leadmate.app",
    },
    publisher: {
      "@type": "Organization",
      name: "LeadMate",
      logo: {
        "@type": "ImageObject",
        url: "https://www.leadmate.app/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.leadmate.app/blog/${post.slug}`,
    },
    datePublished: post.publishedAt?.toString() || new Date().toISOString(),
    dateModified:
      post.updatedAt?.toString() ||
      post.publishedAt?.toString() ||
      new Date().toISOString(),
    keywords:
      post.tags?.map((tag: any) => tag.name).join(", ") ||
      "WhatsApp automation, AI customer support",
    articleSection: "Technology",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      "@id": "https://www.leadmate.app/blog",
      name: "LeadMate Blog",
    },
  };

  return (
    <Script
      id="blog-post-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schema)}
    </Script>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const result = await wisp.getPost(params.slug);

  if (!result || !result.post) {
    notFound();
  }

  const { post } = result;

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
      <BlogPostStructuredData post={post} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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

        {/* Article Header */}
        <header className="mb-8 md:mb-12">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time
                dateTime={post.publishedAt?.toString() || new Date().toString()}
              >
                {formatDate(
                  post.publishedAt?.toString() || new Date().toString()
                )}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getReadingTime()}</span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <span>By</span>
                <span className="text-main font-semibold">
                  {post.author.name}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant="neutral"
                    className="bg-dark-bg text-main border-main/20"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-xl text-foreground leading-relaxed mb-8">
              {post.description}
            </p>
          )}

          {/* Featured Image */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden border border-border mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Share2 className="h-4 w-4" />
              <span>Share this article</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="neutral"
                size="sm"
                className="border-gray-600 hover:border-main text-foreground hover:text-main"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-foreground prose-p:leading-relaxed
            prose-a:text-main prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-em:text-foreground
            prose-code:text-main prose-code:bg-dark-bg prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-dark-bg prose-pre:border prose-pre:border-border
            prose-blockquote:border-l-main prose-blockquote:text-foreground
            prose-ul:text-foreground prose-ol:text-foreground
            prose-li:text-foreground"
          dangerouslySetInnerHTML={{
            __html:
              (post as any).content ||
              post.description ||
              "<p>Content coming soon...</p>",
          }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Author Info */}
            {post.author && (
              <div className="flex items-center gap-4">
                {post.author.image && (
                  <img
                    src={post.author.image || "/logo.png"}
                    alt={post.author.name || "LeadMate Team"}
                    className="w-12 h-12 rounded-full border border-border"
                  />
                )}
                <div>
                  <p className="font-semibold text-white">{post.author.name}</p>
                  <p className="text-foreground text-sm">
                    LeadMate Team Member
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center md:text-right">
              <p className="text-foreground mb-2">
                Ready to automate your WhatsApp customer support?
              </p>
              <Link
                href="/"
                className="text-main hover:text-white font-semibold transition-colors"
              >
                Try LeadMate Free →
              </Link>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Posts Section */}
      <section className="border-t border-border bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Continue Reading
            </h2>
            <Link
              href="/blog"
              className="text-main hover:text-white transition-colors font-semibold"
            >
              View All Articles →
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
