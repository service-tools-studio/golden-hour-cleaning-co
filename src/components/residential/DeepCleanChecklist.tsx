import Link from "next/link";
import { HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList } from "@/components/residential/servicePageParts";

const SECTIONS = [
  {
    title: "Kitchen",
    items: [
      "Clean and sanitize countertops",
      "Clean backsplash",
      "Clean stovetop",
      "Clean inside and outside of the microwave",
      "Clean exterior of appliances",
      "Wipe cabinet fronts to remove fingerprints and buildup",
      "Detail sink and faucet",
      "Spot clean walls as needed",
      "Vacuum and mop floors",
      "Empty trash",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Scrub showers, tubs, and tile",
      "Remove soap scum and buildup",
      "Clean and disinfect toilets",
      "Clean sinks and countertops",
      "Polish mirrors and fixtures",
      "Wipe cabinet fronts",
      "Spot clean walls",
      "Vacuum and mop floors",
      "Empty trash",
    ],
  },
  {
    title: "Bedrooms & Living Areas",
    items: [
      "Dust all accessible surfaces",
      "Dust furniture and décor",
      "Dust baseboards",
      "Clean window sills",
      "Spot clean doors and door frames",
      "Clean light switches",
      "Wipe reachable trim",
      "Vacuum carpets, rugs, and furniture edges",
      "Mop hard floors",
      "Empty trash",
    ],
  },
  {
    title: "Throughout the Home",
    items: [
      "Dust ceiling fan blades (within reach)",
      "Dust vents (within reach)",
      "Dust baseboards throughout",
      "Clean window sills and tracks (light detail)",
      "Spot clean walls",
      "Wipe doors and door frames",
      "Clean light switches",
      "Remove cobwebs",
      "Vacuum under accessible furniture",
      "Vacuum edges and corners",
      "Mop all hard flooring",
    ],
  },
] as const;

type DeepCleanChecklistProps = {
  /** When false, omit the standard-clean intro sentence (page can supply its own). */
  showIntro?: boolean;
  className?: string;
};

export default function DeepCleanChecklist({
  showIntro = true,
  className = "",
}: DeepCleanChecklistProps) {
  return (
    <div className={className}>
      {showIntro ? (
        <p className="text-base leading-relaxed text-stone-700">
          Our deep cleaning includes everything in a{" "}
          <Link
            href="/residential/services/standard#whats-included"
            className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
          >
            standard clean
          </Link>
          , plus additional detailed attention throughout your home.
        </p>
      ) : null}

      <div
        className={`${showIntro ? "mt-6" : ""} space-y-6 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm`}
      >
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              {section.title}
            </h3>
            <BulletList items={[...section.items]} />
          </div>
        ))}
      </div>
    </div>
  );
}
