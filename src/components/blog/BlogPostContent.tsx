import Image from "next/image";
import Link from "next/link";
import { BulletList } from "@/components/residential/servicePageParts";
import { HEADING_UPPER } from "@/helpers/typography.js";
import type { BlogPost, BlogSection } from "@/data/blogPosts";
import { formatBlogDate } from "@/data/blogPosts";

function BlogTable({
  headers,
  rows,
  align,
}: {
  headers: string[];
  rows: string[][];
  align?: Array<"left" | "right" | "center">;
}) {
  const alignClass = (index: number) => {
    const value = align?.[index] ?? "left";
    if (value === "right") return "text-right";
    if (value === "center") return "text-center";
    return "text-left";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white">
      <table className="w-full min-w-[320px] border-collapse text-left text-sm text-stone-700">
        <thead>
          <tr className="border-b border-amber-200 bg-amber-50/80">
            {headers.map((header, index) => (
              <th
                key={header}
                scope="col"
                className={`px-4 py-3 font-semibold text-stone-900 ${alignClass(index)}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.join("-")}
              className="border-b border-amber-100 last:border-b-0"
            >
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={`px-4 py-3 ${alignClass(index)}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlogSectionBody({ section }: { section: BlogSection }) {
  if (section.blocks) {
    return (
      <div className="space-y-4">
        {section.blocks.map((block, index) => {
          if (block.type === "paragraph") {
            return (
              <p
                key={`${block.text}-${index}`}
                className="text-base leading-relaxed text-stone-700"
              >
                {block.text}
              </p>
            );
          }
          if (block.type === "bullets") {
            return <BulletList key={`bullets-${index}`} items={block.items} />;
          }
          return (
            <BlogTable
              key={`table-${index}`}
              headers={block.headers}
              rows={block.rows}
              align={block.align}
            />
          );
        })}
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
      {post.sections.map((section, index) => {
        const HeadingTag = section.headingLevel === 3 ? "h3" : "h2";
        const headingClass =
          section.headingLevel === 3
            ? `text-lg font-semibold text-stone-900 md:text-xl ${HEADING_UPPER}`
            : `text-xl font-semibold text-stone-900 md:text-2xl ${HEADING_UPPER}`;

        return (
          <section key={section.heading ?? `intro-${index}`}>
            {section.heading ? (
              <HeadingTag className={headingClass}>{section.heading}</HeadingTag>
            ) : null}
            <div className={section.heading ? "mt-4" : undefined}>
              <BlogSectionBody section={section} />
              {section.link ? (
                <p className="mt-4">
                  <Link
                    href={section.link.href}
                    className="text-base font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-900"
                  >
                    {section.link.label}
                  </Link>
                </p>
              ) : null}
            </div>
          </section>
        );
      })}
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
