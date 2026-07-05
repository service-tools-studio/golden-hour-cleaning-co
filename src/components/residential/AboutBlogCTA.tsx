import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutBlogCTA() {
  return (
    <section className="mx-auto my-20 max-w-5xl px-6">
      <div className="rounded-3xl border border-[#dcbb52]/20 bg-[#a7eff1] px-8 py-14 text-center shadow-sm md:px-14">
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#a7eff1]" />

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#333333]">
          From Our Founders
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-[#333333] md:text-4xl">
          Read More About the Heart Behind Golden Hour
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#333333]/75">
          Our blog shares reflections, cleaning tips, and behind-the-scenes
          stories from building Golden Hour Cleaning Co. with care, quality, and
          intention.
        </p>

        <Link
          href="/blog"
          className="mt-9 inline-flex items-center justify-center rounded-full bg-[#dcbb52] px-8 py-4 font-medium text-[#333333] transition-all duration-200 hover:scale-[1.02] hover:brightness-95"
        >
          Read Our Blog
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
