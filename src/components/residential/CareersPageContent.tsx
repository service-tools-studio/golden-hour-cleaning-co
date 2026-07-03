import Image from "next/image";
import { HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList, Section } from "./servicePageParts";

const EMAIL = "golden.hour.cleaning.company@gmail.com";

export default function CareersPageContent() {
  return (
    <>
      <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Golden Hour Cleaning Co. is Hiring!
      </h1>

      <div className="mt-6 sm:overflow-hidden">
        <figure className="mx-auto mb-6 w-full max-w-[220px] overflow-hidden rounded-3xl border border-amber-200 shadow-sm sm:float-left sm:mb-4 sm:mr-6 sm:w-[220px] md:w-[260px]">
          <Image
            src="/assets/join-our-team.png"
            alt="Golden Hour Cleaning Co. team member in a bright, freshly cleaned kitchen"
            width={1200}
            height={1600}
            sizes="(max-width: 639px) 220px, 260px"
            className="h-auto w-full"
            priority
          />
        </figure>

        <div className="space-y-4 text-base leading-relaxed text-stone-700">
          <p>
            We&apos;re growing and looking for exceptional independent cleaning
            contractors to join our team serving the Portland metro area.
          </p>
          <p>
            We&apos;re looking for people who are more than just great cleaners. We
            value individuals who are:
          </p>
        </div>

        <BulletList
          items={[
            "Reliable and dependable",
            "Excellent communicators who respond promptly",
            "Detail-oriented and take pride in their work",
            "Professional and kind with clients",
            "Organized, efficient, and able to work independently",
            "Coachable and open to feedback",
            "Respectful, thoughtful, and easy to work with",
            "Physically able to perform residential cleaning",
            "Have reliable transportation and are consistently on time",
          ]}
        />

        <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
          <p>
            At Golden Hour Cleaning Co., we believe a clean home starts with
            cleaners who genuinely care about people and the quality of their work.
            We&apos;re building a team that values integrity, professionalism, and
            creating an exceptional experience for every client.
          </p>
        </div>

        <Section title="What we offer">
          <BulletList
            items={[
              "Flexible scheduling—you choose the jobs you accept",
              "Competitive contractor pay",
              "A supportive, respectful team environment",
              "Opportunities for recurring residential, move-out, and commercial cleaning",
            ]}
          />
        </Section>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
          <p>
            Cleaning experience is preferred, but if you have a strong work ethic,
            great communication skills, and a commitment to excellence, we&apos;d
            love to hear from you.
          </p>
          <p>
            If this sounds like a good fit, send your resume to{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
            >
              {EMAIL}
            </a>
            .
          </p>
          <p>We can&apos;t wait to meet you!</p>
        </div>
      </div>
    </>
  );
}
