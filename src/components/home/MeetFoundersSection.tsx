import Image from "next/image";
import Link from "next/link";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

export default function MeetFoundersSection() {
  return (
    <section
      aria-labelledby="founders-heading"
      className="bg-[#fffbea] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="founders-heading"
          className={`text-center text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
        >
          Meet the Founders
        </h2>

        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-6">
          <figure className="w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:max-w-[240px]">
            <Image
              src="/assets/kelsey-collins.JPG"
              alt="Kelsey Collins, Co-Founder of Golden Hour Cleaning Co."
              width={480}
              height={640}
              className="h-auto w-full"
              sizes="240px"
            />
          </figure>
          <figure className="w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:max-w-[240px]">
            <Image
              src="/assets/jasmin-heart.JPG"
              alt="Jasmin Heart, Co-Founder of Golden Hour Cleaning Co."
              width={480}
              height={640}
              className="h-auto w-full"
              sizes="240px"
            />
          </figure>
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-stone-700 sm:text-lg">
          Golden Hour Cleaning Co. was founded by Kelsey Collins and Jasmin Heart with
          one mission: provide exceptional cleaning services while delivering a customer
          experience built on trust, communication, and genuine care.
        </blockquote>

        <div className="mt-8 flex justify-center">
          <Link
            href="/about"
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50`}
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
