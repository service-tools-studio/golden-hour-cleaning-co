import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Heart,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { label: string; Icon: LucideIcon }[] = [
  { label: "Thoughtful communication", Icon: MessageCircle },
  { label: "Instant quotes & online booking", Icon: CalendarCheck },
  { label: "Meticulous attention to detail", Icon: Sparkles },
  { label: "A team that genuinely cares", Icon: Heart },
];

const FOUNDERS = [
  {
    name: "Kelsey Collins",
    src: "/assets/kelsey-collins.JPG",
    alt: "Kelsey Collins, Co-Founder of Golden Hour Cleaning Co.",
    bio: "Kelsey brings decades of professional cleaning experience and leads our service standards with warmth, nurturing, and an expert eye for detail.",
    imageClassName: "object-top",
  },
  {
    name: "Jasmin Heart",
    src: "/assets/jasmin-heart.JPG",
    alt: "Jasmin Heart, Co-Founder of Golden Hour Cleaning Co.",
    bio: "Jasmin brings a background in software engineering and business operations, creating the systems that make booking, communication, and the client experience feel effortless.",
    imageClassName: "object-[center_38%]",
  },
] as const;

export default function ClientExperienceSection() {
  return (
    <section className="bg-white px-5 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52]">
            The Golden Hour Difference
          </p>

          <h2 className="max-w-3xl text-4xl font-semibold uppercase leading-tight tracking-[0.08em] text-[#333333] md:text-5xl">
            A Cleaning Experience Built Around{" "}
            <span className="underline decoration-[#a7eff1] decoration-[0.2em] underline-offset-[0.15em]">
              You
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#333333]/75">
            From the moment you request a quote to the moment you walk into your
            freshly cleaned home, every part of the Golden Hour experience is
            designed to feel thoughtful, seamless, and genuinely caring.
          </p>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#333333]/75">
            We believe exceptional cleaning is more than spotless surfaces. It is
            clear communication, dependable service, meticulous attention to
            detail, and a team that treats your home with care.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[#dcbb52]/30 bg-[#fffbea] px-4 py-4"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#dcbb52]" aria-hidden />
                <span className="font-medium text-[#333333]">{label}</span>
              </div>
            ))}
          </div>

          <Link
            href="/residential/services"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#333333] px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#dcbb52] hover:text-[#333333]"
          >
            Explore Services
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="rounded-[2rem] border border-[#dcbb52]/25 bg-[#a7eff1] p-7 shadow-sm md:p-9">
          <div className="mb-6 h-1 w-20 rounded-full bg-[#dcbb52]" />

          <h3 className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#333333]">
            Built by People Who Care
          </h3>

          <p className="mt-5 leading-7 text-[#333333]/75">
            Golden Hour Cleaning Co. was founded by Kelsey Collins and Jasmin
            Heart with one simple goal: to create the kind of cleaning company
            we would want to hire ourselves.
          </p>

          <div className="mt-7 space-y-6">
            {FOUNDERS.map(({ name, src, alt, bio, imageClassName }) => (
              <div key={name} className="flex gap-4">
                <figure className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#dcbb52]/30 shadow-sm sm:h-28 sm:w-24">
                  <Image
                    src={src}
                    alt={alt}
                    width={480}
                    height={640}
                    className={`h-full w-full object-cover ${imageClassName}`}
                    sizes="96px"
                  />
                </figure>
                <div className="min-w-0">
                  <h4 className="font-semibold text-[#333333]">{name}</h4>
                  <p className="mt-1 leading-7 text-[#333333]/70">{bio}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#333333] underline decoration-[#dcbb52] decoration-2 underline-offset-4"
          >
            Meet the Founders
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
