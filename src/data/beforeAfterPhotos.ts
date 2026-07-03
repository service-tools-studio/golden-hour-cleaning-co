export const BEFORE_AFTER_PHOTOS = [
  {
    id: "closet",
    title: "Linen closet",
    alt: "Before and after: cluttered linen closet transformed into neatly folded towels and organized shelves",
  },
  {
    id: "bathroom",
    title: "Bathroom",
    alt: "Before and after: dated bathroom with grimy fixtures transformed into a bright, clean space with sparkling white tub, sink, and toilet",
  },
  {
    id: "floors",
    title: "Hardwood floors",
    alt: "Before and after: dull hardwood floors restored to a polished, reflective shine",
  },
  {
    id: "oven",
    title: "Inside oven",
    alt: "Before and after: greasy oven interior and door glass cleaned to a spotless finish",
  },
  {
    id: "stove",
    title: "Glass cooktop",
    alt: "Before and after: burnt-on residue on a glass stovetop removed for a clear, polished surface",
  },
] as const;

export function beforeAfterSrc(name: string) {
  return `/assets/${encodeURIComponent(`before & after - ${name}.png`)}`;
}
