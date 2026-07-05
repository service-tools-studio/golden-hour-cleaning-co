import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogPostContent from "@/components/blog/BlogPostContent";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import {
  BLOG_SLUGS,
  getBlogPostBySlug,
} from "@/data/blogPosts";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | Golden Hour Cleaning Co.`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#quote" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <BlogPostContent post={post} />
        </div>

        <BlogCTA />

        <Footer />
      </main>
    </>
  );
}
