import { splitConditionBands } from "@/lib/quotePricing";
import { formatCurrency } from "@/helpers/contactHelpers.js";

const BAND_COPY = [
  {
    id: "light",
    title: "Light Buildup",
    desc: "Regularly maintained with minimal accumulated dust, grease, soap scum or pet hair.",
    barClass: "bg-amber-100",
    cardClass: "bg-amber-100/25",
  },
  {
    id: "moderate",
    title: "Moderate Buildup",
    desc: "Typical lived-in condition with visible dust and some bathroom, kitchen or pet-related buildup.",
    barClass: "bg-amber-300",
    cardClass: "bg-amber-300/20",
  },
  {
    id: "heavy",
    title: "Heavy Buildup",
    desc: "Significant accumulated dust, grease, soap scum, pet hair or grime, or areas that have not been thoroughly cleaned for an extended period.",
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
        How condition affects your price
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 md:hidden">
        {bands.map((band, index) => (
          <div
            key={band.id}
            className={`px-4 py-3 ${band.barClass} ${
              index < bands.length - 1 ? "border-b border-stone-200/80" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-[0_0_42%]">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-800">
                  {band.title}
                </p>
                <p className="mt-1 text-base font-semibold tabular-nums text-stone-900">
                  {formatCurrency(band.low)}–{formatCurrency(band.high)}
                </p>
              </div>
              <p className="min-w-0 flex-1 text-xs leading-snug text-stone-700">
                {band.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 hidden min-h-16 overflow-hidden rounded-full border border-stone-200 md:flex md:min-h-14"
        role="img"
        aria-label={`Price range by home condition: light buildup ${moneyLabel(bands[0].low)} to ${moneyLabel(bands[0].high)}, moderate buildup ${moneyLabel(bands[1].low)} to ${moneyLabel(bands[1].high)}, heavy buildup ${moneyLabel(bands[2].low)} to ${moneyLabel(bands[2].high)}.`}
      >
        {bands.map((band) => (
          <div
            key={band.id}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center px-0.5 py-1.5 text-center sm:px-1 ${band.barClass}`}
          >
            <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-stone-800 sm:text-xs">
              {band.title}
            </span>
            <span className="text-[11px] tabular-nums leading-tight text-stone-800 sm:text-xs">
              {formatCurrency(band.low)}–{formatCurrency(band.high)}
            </span>
          </div>
        ))}
      </div>

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
