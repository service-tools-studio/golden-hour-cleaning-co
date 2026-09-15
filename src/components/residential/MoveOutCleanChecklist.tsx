import Link from "next/link";
import { HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList } from "@/components/residential/servicePageParts";

const SECTIONS = [
  {
    title: "Kitchen",
    items: [
      "Clean inside and outside of cabinets and drawers",
      "Clean countertops and backsplash",
      "Clean sink and faucet",
      "Clean stovetop",
      "Clean inside and outside of the oven",
      "Clean inside and outside of the microwave",
      "Clean exterior of appliances",
      "Wipe doors, trim, and baseboards",
      "Vacuum and mop floors",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Scrub showers, tubs, and tile",
      "Remove soap scum and mineral buildup",
      "Clean and disinfect toilets",
      "Clean sinks and countertops",
      "Polish mirrors and fixtures",
      "Clean inside cabinets and drawers",
      "Wipe doors, trim, and baseboards",
      "Vacuum and mop floors",
    ],
  },
  {
    title: "Bedrooms & Living Areas",
    items: [
      "Dust all accessible surfaces",
      "Dust baseboards, trim, and window sills",
      "Spot clean walls as needed",
      "Clean doors and door frames",
      "Clean light switches",
      "Vacuum carpets and hard-to-reach edges",
      "Mop hard floors",
      "Remove cobwebs",
    ],
  },
  {
    title: "Throughout the Home",
    items: [
      "Dust ceiling fans (within reach)",
      "Dust vents (within reach)",
      "Clean baseboards throughout",
      "Clean window sills and tracks",
      "Spot clean walls",
      "Wipe doors and trim",
      "Vacuum closets",
      "Vacuum under accessible areas",
      "Mop all hard flooring",
    ],
  },
] as const;

type MoveOutCleanChecklistProps = {
  /** When false, omit the intro sentence (page can supply its own). */
  showIntro?: boolean;
  className?: string;
};

export default function MoveOutCleanChecklist({
  showIntro = true,
  className = "",
}: MoveOutCleanChecklistProps) {
  return (
    <div className={className}>
      {showIntro ? (
        <p className="text-base leading-relaxed text-stone-700">
          Our move-in and move-out cleaning includes everything in a{" "}
          <Link
            href="/deep-clean/whats-included"
            className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
          >
            deep clean
          </Link>
          , plus additional detail for empty homes — including inside cabinets
          and drawers, inside the oven, and inside the refrigerator when
          accessible.
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
