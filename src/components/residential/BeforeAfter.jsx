import Image from "next/image";
import { HEADING_UPPER } from "../../helpers/typography.js";
import { BEFORE_AFTER_PHOTOS, beforeAfterSrc } from "@/data/beforeAfterPhotos";

export default function BeforeAfter() {
  return (
    <section
      id="before-after"
      aria-labelledby="before-after-heading"
      className="mx-auto max-w-6xl px-4 pt-6 pb-20"
    >
      <h2 id="before-after-heading" className={`text-3xl mt-0 ${HEADING_UPPER}`}>
        Before &amp; After
      </h2>
      <p className="mt-1 max-w-2xl text-stone-700">
        Real results from Golden Hour visits — closets, bathrooms, floors, kitchens, and
        more. Every photo is a side-by-side from the same home.
      </p>

      <ul className="mt-8 grid gap-8 sm:grid-cols-2">
        {BEFORE_AFTER_PHOTOS.map(({ id, title, alt }) => (
          <li key={id}>
            <figure className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] w-full bg-stone-100">
                <Image
                  src={beforeAfterSrc(id)}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="border-t border-amber-100 px-4 py-3 text-sm font-medium text-stone-800">
                {title}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
