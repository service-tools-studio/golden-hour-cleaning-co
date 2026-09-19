/**
 * @param {{ icon: import('react').ReactNode; label: string; onClick?: () => void }} props
 */
export function Badge({ icon, label, onClick }) {
  const className =
    "flex h-14 w-full min-w-0 items-center gap-2 rounded-xl border border-amber-200 bg-white px-2.5 sm:h-16 sm:px-3";
  const inner = (
    <>
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100/80 [&_svg]:block [&_svg]:h-3.5 [&_svg]:w-3.5 sm:[&_svg]:h-4 sm:[&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 break-words text-xs font-medium leading-snug text-stone-800 sm:text-[13px] sm:leading-none">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} cursor-pointer text-left hover:border-amber-300 hover:bg-amber-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
      >
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}

export function Step({ number, title, desc }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-sm font-semibold text-stone-900 sm:h-9 sm:w-9">
          {number}
        </div>
        <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
        {desc}
      </p>
    </div>
  );
}

export function Row({ label, a, b }) {
  return (
    <tr>
      <td className="px-4 py-3 text-stone-700">{label}</td>
      <td className="px-4 py-3 font-medium text-stone-900">{a}</td>
      <td className="px-4 py-3 text-stone-600">{b}</td>
    </tr>
  );
}

export function BadgeDot() {
  return (
    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
      <span className="h-2 w-2 rounded-full bg-amber-400" />
    </span>
  );
}