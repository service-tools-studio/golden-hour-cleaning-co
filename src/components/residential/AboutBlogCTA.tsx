import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BTN_PRIMARY } from "@/helpers/typography.js";

export default function AboutBlogCTA() {
  return (
    <section className="mx-auto my-20 max-w-5xl px-6">
      <div className="rounded-3xl border border-amber-200/40 bg-[#a7eff1] px-8 py-14 text-center shadow-sm md:px-14">
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-amber-400/60" />

        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-900">
          From Our Founders
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
          Read More About the Heart Behind Golden Hour
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-700">
          Our blog shares reflections, cleaning tips, and behind-the-scenes
          stories from building Golden Hour Cleaning Co. with care, quality, and
          intention.
        </p>

        <Link href="/blog" className={`${BTN_PRIMARY} mt-9`}>
          Read Our Blog
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
