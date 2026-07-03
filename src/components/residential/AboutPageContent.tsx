import Image from "next/image";
import { HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList, Section } from "./servicePageParts";

export default function AboutPageContent() {
  return (
    <>
      <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        About Golden Hour Cleaning Co.
      </h1>
      <p className={`mt-3 text-lg text-stone-700 ${HEADING_UPPER}`}>
        A Partnership Built on Care, Quality, and Excellence
      </p>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
        <p>
          Golden Hour Cleaning Co. was founded by Kelsey Collins and Jasmin Heart,
          two business partners with complementary strengths and a shared
          commitment to providing exceptional cleaning services throughout the
          Portland metro area.
        </p>
        <p>
          While our backgrounds are very different, we share the same belief:
          every client deserves dependable service, thoughtful communication, and
          a home they genuinely enjoy coming back to.
        </p>
        <p>
          Together, we&apos;ve built Golden Hour Cleaning Co. around the values
          of integrity, professionalism, and attention to detail—because we
          believe a clean home creates more time and space for what matters
          most.
        </p>
      </div>

      <Section title="Meet Kelsey Collins">
        <div className="sm:overflow-hidden">
          <figure className="mx-auto mb-6 w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:float-left sm:mb-4 sm:mr-6 sm:w-[220px] md:w-[260px]">
            <Image
              src="/assets/kelsey-collins.JPG"
              alt="Kelsey Collins, Co-Founder and Head Cleaner at Golden Hour Cleaning Co."
              width={1200}
              height={1600}
              sizes="(max-width: 639px) 220px, 260px"
              className="h-auto w-full"
            />
          </figure>
          <div className="space-y-4 text-base leading-relaxed text-stone-700">
            <p>
              As Co-Founder and Director of Cleaning Operations, Kelsey brings decades of hands-on
              experience in the professional cleaning industry.
            </p>
            <p>
              Over the years, she has developed an exceptional eye for detail and a
              deep understanding of what separates an average cleaning from an
              outstanding one. Her expertise shapes the standards we hold ourselves
              to on every job, and she takes pride in mentoring our team to deliver
              consistently high-quality results.
            </p>
            <p>
              Beyond her technical knowledge, Kelsey is known for her warm, nurturing
              personality and genuine care for people. She believes every client
              deserves to feel heard, respected, and valued, and she works hard to
              build lasting relationships based on trust and reliability.
            </p>
            <p>
              Whether she&apos;s leading a deep clean, training cleaners, or helping
              a client find the right service for their home, Kelsey approaches every
              interaction with kindness, professionalism, and a commitment to
              excellence.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Meet Jasmin Heart">
        <div className="sm:overflow-hidden">
          <figure className="mx-auto mb-6 w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:float-left sm:mb-4 sm:mr-6 sm:w-[220px] md:w-[260px]">
            <Image
              src="/assets/jasmin-heart.JPG"
              alt="Jasmin Heart, Co-Founder and Operations Director at Golden Hour Cleaning Co."
              width={1200}
              height={1600}
              sizes="(max-width: 639px) 220px, 260px"
              className="h-auto w-full"
            />
          </figure>
          <div className="space-y-4 text-base leading-relaxed text-stone-700">
            <p>
              Jasmin brings a unique blend of technology, strategy, and business operations to Golden Hour Cleaning Co. Before co-founding the company, she worked as a software engineer, where she developed expertise in designing efficient systems, solving complex problems, and creating intuitive user experiences.
            </p>
            <p>
              Today, she applies that same systems-oriented mindset to every aspect of the business behind the scenes. From technology and website management to scheduling, marketing, finance, customer communication, and business strategy, Jasmin is focused on creating a company that is organized, dependable, and built for long-term excellence.
            </p>
            <p>
              She believes that exceptional service extends far beyond the cleaning itself. Every interaction—from requesting a quote and booking online to receiving timely communication and reliable service—should feel simple, transparent, and thoughtfully designed. Her mission is to build systems that allow both clients and the Golden Hour team to have an outstanding experience from start to finish.
            </p>
            <p>
              Driven by a passion for continuous improvement, Jasmin is always looking for ways to refine processes, embrace new technology, and raise the standard of what clients can expect from a professional cleaning company.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Better Together">
        <p className="text-base leading-relaxed text-stone-700">
          At Golden Hour Cleaning Co., we believe our greatest strength is the
          combination of our different backgrounds.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Kelsey&apos;s decades of professional cleaning expertise ensure every
          service meets the highest standards of quality, while Jasmin&apos;s
          experience in technology and operations helps create an efficient,
          dependable experience from the moment you request a quote to the
          completion of your cleaning.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Together, we&apos;ve built a company that values both exceptional
          craftsmanship and exceptional customer service.
        </p>
      </Section>

      <Section title="Our Commitment to You">
        <p className="text-base leading-relaxed text-stone-700">
          When you invite Golden Hour Cleaning Co. into your home, you&apos;re
          choosing a team that believes in doing things the right way.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          That means:
        </p>
        <BulletList
          items={[
            "Friendly, professional service",
            "Honest and transparent communication",
            "Exceptional attention to detail",
            "Respect for your home and belongings",
            "Reliable scheduling and punctuality",
            "Consistent, high-quality results",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Whether you need recurring home cleaning, a deep clean, a move-in or
          move-out cleaning, or commercial cleaning services, our goal is to
          provide a level of care and professionalism that gives you complete
          confidence in choosing Golden Hour Cleaning Co.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          We are proud to serve homeowners, renters, and businesses throughout
          Portland, Oregon, and the surrounding communities, and we look
          forward to helping you enjoy a cleaner, more comfortable space.
        </p>
      </Section>
    </>
  );
}
