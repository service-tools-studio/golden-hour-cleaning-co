import { splitConditionBands } from "@/lib/quotePricing";
import { formatCurrency } from "@/helpers/contactHelpers.js";

const BAND_COPY = [
  {
    id: "light",
    title: "Light Buildup",
    shortLabel: "Light",
    summary: ["Minimal", "buildup"],
    desc: "Regularly maintained with minimal accumulated dust, grease, soap scum or pet hair.",
    barClass: "bg-amber-100",
    cardClass: "bg-amber-100/25",
  },
  {
    id: "moderate",
    title: "Moderate Buildup",
    shortLabel: "Moderate",
    summary: ["Typical", "buildup"],
    desc: "Typical lived-in condition with visible dust and some bathroom, kitchen or pet-related buildup.",
    barClass: "bg-amber-300",
    cardClass: "bg-amber-300/20",
  },
  {
    id: "heavy",
    title: "Heavy Buildup",
    shortLabel: "Heavy",
    summary: ["Significant", "buildup"],
    desc: "Significant accumulated dust, grease, soap scum, pet hair or grime; areas may not have been thoroughly cleaned for some time.",
    barClass: "bg-[#dcbb52]",
    cardClass: "bg-[#dcbb52]/15",
  },
] as const;

function moneyLabel(n: number) {
  return `$${Number(n).toLocaleString()}`;
}

export default function DeepCleanConditionRange({
  low,
  high,
}: {
  low: number;
  high: number;
}) {
  const split = splitConditionBands(low, high);
  if (!split) return null;

  const bands = split.map((band, index) => ({
    ...band,
    ...BAND_COPY[index],
  }));

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
        How condition affects your estimate
      </p>

      <div
        className="mt-4 flex min-h-[3.75rem] overflow-hidden rounded-full border border-stone-200 md:min-h-[4.25rem]"
        role="img"
        aria-label={`Price range by home condition: light ${moneyLabel(bands[0].low)} to ${moneyLabel(bands[0].high)}, moderate ${moneyLabel(bands[1].low)} to ${moneyLabel(bands[1].high)}, heavy ${moneyLabel(bands[2].low)} to ${moneyLabel(bands[2].high)}.`}
      >
        {bands.map((band) => (
          <div
            key={band.id}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center px-0.5 py-2 text-center sm:px-1 ${band.barClass}`}
          >
            <span className="text-xs font-semibold uppercase leading-tight tracking-wide text-stone-800">
              {band.shortLabel}
            </span>
            <span className="text-base font-semibold tabular-nums leading-tight text-stone-800">
              {formatCurrency(band.low)}–{formatCurrency(band.high)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-snug text-stone-600 md:hidden">
        Your home&apos;s condition determines where your estimate falls
        within this range. We consider accumulated dust, grease, soap scum,
        pet hair, grime and overall buildup.
      </p>

      <ul className="mt-4 hidden grid-cols-3 gap-3 md:grid">
        {bands.map((band) => (
          <li key={band.id} className={`rounded-xl px-4 py-3 ${band.cardClass}`}>
            <p className="text-sm font-semibold text-stone-900">{band.title}</p>
            <p className="mt-0.5 text-sm tabular-nums text-stone-800">
              {formatCurrency(band.low)}–{formatCurrency(band.high)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              {band.desc}
            </p>
          </li>
        ))}
      </ul>

    </div>
  );
}
