import Image from "next/image";
import Link from "next/link";
import {
  BTN_SECONDARY,
  SECTION_HEADING,
  SECTION_PAD,
} from "@/helpers/typography.js";

export default function MeetFoundersSection() {
  return (
    <section
      aria-labelledby="founders-heading"
      className={`bg-amber-50 ${SECTION_PAD}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="founders-heading" className={SECTION_HEADING}>
          Meet the Founders
        </h2>

        <div className="mt-10 flex justify-center">
          <figure className="w-full max-w-[360px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:max-w-[420px]">
            <Image
              src="/assets/kelsey-and-jasmin.JPG"
              alt="Kelsey Collins and Jasmin Heart, Co-Founders of Golden Hour Cleaning Co."
              width={1030}
              height={1562}
              className="h-auto w-full"
              sizes="(max-width: 640px) 90vw, 420px"
            />
          </figure>
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-stone-700 sm:text-lg">
          Golden Hour Cleaning Co. was founded by Kelsey Collins and Jasmin Heart with
          one mission: provide exceptional cleaning services while delivering a customer
          experience built on trust, communication, and genuine care.
        </blockquote>

        <div className="mt-8 flex justify-center">
          <Link href="/about" className={BTN_SECONDARY}>
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
