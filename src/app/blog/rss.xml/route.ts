import { NextResponse } from "next/server";
import { wisp } from "@/lib/wisp";

export async function GET() {
  try {
    const result = await wisp.getPosts({ limit: 50 });
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://www.leadmate.app";

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LeadMate Blog - WhatsApp AI &amp; Customer Support</title>
    <description>Expert insights, practical guides, and proven strategies for WhatsApp automation, AI customer support, and small business growth.</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <category>Technology</category>
    <category>Business</category>
    <category>Customer Service</category>
    <category>WhatsApp Automation</category>
    <category>AI</category>
    <copyright>© ${new Date().getFullYear()} LeadMate. All rights reserved.</copyright>
    <managingEditor>sherifelamir2003@gmail.com (LeadMate Team)</managingEditor>
    <webMaster>sherifelamir2003@gmail.com (LeadMate Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>LeadMate Blog RSS Generator</generator>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>LeadMate</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>LeadMate - AI WhatsApp Customer Support Automation</description>
    </image>
    ${result.posts
      .map((post) => {
        const postContent =
          (post as any).content ||
          post.description ||
          "Read more about WhatsApp automation and AI customer support.";
        const cleanContent = postContent
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

        const description =
          post.description || cleanContent.substring(0, 200) + "...";
        const cleanDescription = description
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${cleanDescription}]]></description>
      <content:encoded><![CDATA[${postContent}]]></content:encoded>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || new Date()).toUTCString()}</pubDate>
      <author>sherifelamir2003@gmail.com (${post.author?.name || "LeadMate Team"})</author>
      ${post.tags?.map((tag) => `<category><![CDATA[${tag.name}]]></category>`).join("\n      ") || ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);

    return new NextResponse("Error generating RSS feed", {
      status: 500,
    });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour
