import Image from "next/image";
import Link from "next/link";
import { BulletList } from "@/components/residential/servicePageParts";
import { HEADING_UPPER } from "@/helpers/typography.js";
import type { BlogPost, BlogSection } from "@/data/blogPosts";
import { formatBlogDate } from "@/data/blogPosts";

function BlogSectionBody({ section }: { section: BlogSection }) {
  if (section.blocks) {
    return (
      <div className="space-y-4">
        {section.blocks.map((block, index) =>
          block.type === "paragraph" ? (
            <p
              key={`${block.text}-${index}`}
              className="text-base leading-relaxed text-stone-700"
            >
              {block.text}
            </p>
          ) : (
            <BulletList key={`bullets-${index}`} items={block.items} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className="text-base leading-relaxed text-stone-700"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function BlogSections({ post }: { post: BlogPost }) {
  return (
    <>
      {post.sections.map((section, index) => (
        <section key={section.heading ?? `intro-${index}`}>
          {section.heading ? (
            <h2
              className={`text-xl font-semibold text-stone-900 md:text-2xl ${HEADING_UPPER}`}
            >
              {section.heading}
            </h2>
          ) : null}
          <div className={section.heading ? "mt-4" : undefined}>
            <BlogSectionBody section={section} />
          </div>
        </section>
      ))}
    </>
  );
}

function PortraitHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <figure className="mx-auto mb-6 w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:float-right sm:mb-4 sm:ml-6 sm:w-[220px] md:w-[260px]">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={1600}
        sizes="(max-width: 639px) 220px, 260px"
        className="h-auto w-full"
        priority
      />
    </figure>
  );
}

function LandscapeHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <figure className="mt-8 overflow-hidden rounded-3xl border border-amber-200 bg-stone-100 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes="(max-width: 768px) 100vw, 672px"
        className="h-auto w-full"
        priority
      />
    </figure>
  );
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const backLinkClass =
    "uppercase tracking-wide inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline";

  const isPortrait = post.heroImage?.orientation === "portrait";

  return (
    <article>
      <Link href="/blog" className={backLinkClass}>
        <span aria-hidden>←</span>
        Back to all posts
      </Link>

      <header className="mt-6">
        <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-stone-600">
          By {post.author}, {post.authorRole}
        </p>
        <time
          dateTime={post.publishedAt}
          className="mt-1 block text-sm text-stone-500"
        >
          {formatBlogDate(post.publishedAt)}
        </time>
      </header>

      {post.heroImage && isPortrait ? (
        <div className="mt-8 sm:overflow-hidden">
          <PortraitHeroImage
            src={post.heroImage.src}
            alt={post.heroImage.alt}
          />
          <div className="space-y-10">
            <BlogSections post={post} />
          </div>
        </div>
      ) : (
        <>
          {post.heroImage ? (
            <LandscapeHeroImage
              src={post.heroImage.src}
              alt={post.heroImage.alt}
            />
          ) : null}
          <div className={post.heroImage ? "mt-10 space-y-10" : "mt-8 space-y-10"}>
            <BlogSections post={post} />
          </div>
        </>
      )}

      <footer className="mt-12 border-t border-amber-200 pt-8">
        <Link
          href="/blog"
          className="text-sm font-semibold text-stone-700 underline underline-offset-4 hover:text-stone-900"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
