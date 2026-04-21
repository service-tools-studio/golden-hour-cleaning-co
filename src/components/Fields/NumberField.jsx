export default function NumberField({
  label,
  value,
  setValue,
  min = 0,
  step = 1,
  showStepper = false,
}) {
  const numericStep = Number(step);
  const isFractionalStep = numericStep % 1 !== 0;

  const formatDisplay = (v) => {
    if (v === 0 || v === "") return "";
    if (!isFractionalStep) return v;
    return v % 1 === 0 ? String(v) : String(Math.round(v * 10) / 10);
  };

  const displayValue = formatDisplay(value);

  const clamp = (n) => Math.max(min, n);

  const snapToStep = (n) => {
    if (!isFractionalStep || numericStep <= 0) return n;
    const snapped = Math.round(n / numericStep) * numericStep;
    return Math.round(snapped * 1000) / 1000;
  };

  const parseInput = (raw) => {
    if (raw === "") return 0;
    const n = isFractionalStep ? parseFloat(raw) : parseInt(raw, 10);
    if (Number.isNaN(n)) return 0;
    return isFractionalStep ? snapToStep(n) : n;
  };

  const increment = () => {
    const next = snapToStep(value + numericStep);
    setValue(clamp(next));
  };

  const decrement = () => {
    const next = snapToStep(value - numericStep);
    setValue(clamp(next));
  };

  const btnClass =
    "inline-flex shrink-0 items-center justify-center rounded-xl border border-stone-300 bg-white px-3 py-2 text-lg font-semibold leading-none text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40";

  const inputClass =
    "mt-1 min-w-0 flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300";

  const inner = (
    <>
      {showStepper ? (
        <div className="mt-1 flex items-stretch gap-2">
          <button
            type="button"
            className={btnClass}
            aria-label={`Decrease ${label}`}
            disabled={value <= min}
            onClick={decrement}
          >
            −
          </button>
          <input
            type="number"
            min={min}
            step={step}
            inputMode={isFractionalStep ? "decimal" : "numeric"}
            value={displayValue}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setValue(0);
              } else {
                setValue(parseInput(raw));
              }
            }}
            onBlur={(e) => {
              if (isFractionalStep && e.target.value !== "") {
                setValue(snapToStep(parseInput(e.target.value)));
              }
            }}
            className={inputClass}
          />
          <button
            type="button"
            className={btnClass}
            aria-label={`Increase ${label}`}
            onClick={increment}
          >
            +
          </button>
        </div>
      ) : (
        <input
          type="number"
          min={min}
          step={step}
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setValue(0);
            } else {
              setValue(parseInput(raw));
            }
          }}
          className={`mt-1 w-full ${inputClass}`}
        />
      )}
    </>
  );

  return (
    <label className="block text-sm">
      <span className="text-stone-700">{label}</span>
      {inner}
    </label>
  );
}
