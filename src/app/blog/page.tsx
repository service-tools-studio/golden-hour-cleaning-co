import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { BLOG_POSTS, formatBlogDate } from "@/data/blogPosts";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Blog | Golden Hour Cleaning Co.",
  description:
    "Stories, insights, and reflections from the Golden Hour Cleaning Co. team—professional cleaning in Portland and the metro area.",
};

export default function BlogPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#quote" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <header>
            <h1 className={`text-3xl md:text-4xl ${HEADING_UPPER}`}>Blog</h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700">
              Stories and reflections from our team on cleaning, care, and building
              a heart-aligned business.
            </p>
          </header>

          <ul className="mt-12 space-y-6">
            {BLOG_POSTS.map((post) => (
              <li key={post.slug}>
                <article className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md">
                  <div className="flex gap-4 sm:gap-5">
                    {post.heroImage ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-amber-100 bg-stone-100 sm:h-24 sm:w-24"
                        aria-hidden
                        tabIndex={-1}
                      >
                        <Image
                          src={post.heroImage.src}
                          alt=""
                          fill
                          sizes="96px"
                          className={`object-cover ${
                            post.heroImage.orientation === "portrait"
                              ? "object-top"
                              : "object-center"
                          }`}
                        />
                      </Link>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <time
                        dateTime={post.publishedAt}
                        className="text-xs font-medium uppercase tracking-wide text-stone-500"
                      >
                        {formatBlogDate(post.publishedAt)}
                      </time>
                      <h2 className={`mt-2 text-xl font-semibold ${HEADING_UPPER}`}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-stone-900 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-stone-600">
                        By {post.author}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-stone-700">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-flex text-sm font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-700"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <Footer />
      </main>
    </>
  );
}
