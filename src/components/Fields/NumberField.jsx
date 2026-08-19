import { QUOTE_FIELD_LABEL } from "../../helpers/typography.js";
import { quoteFieldId } from "../../helpers/fieldIds.js";

const INPUT_CLASS =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-300";

export default function NumberField({
  label,
  value,
  setValue,
  min = 0,
  step = 1,
  showStepper = false,
  id,
  describedBy,
  onBlur = undefined,
}) {
  const fieldId = id ?? quoteFieldId(label);
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

  const stepperBtnClass =
    "flex w-9 shrink-0 items-center justify-center bg-white text-base font-medium leading-none text-stone-700 transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40";

  const inputProps = {
    id: fieldId,
    type: "number",
    min,
    step,
    "aria-describedby": describedBy,
    "aria-valuemin": min,
    "aria-valuenow": value,
  };

  const inner = showStepper ? (
    <div
      className="inline-flex w-full max-w-[156px] overflow-hidden rounded-xl border border-stone-200 bg-white"
      role="group"
      aria-labelledby={`${fieldId}-label`}
    >
      <button
        type="button"
        className={`${stepperBtnClass} border-r border-stone-200`}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={decrement}
      >
        <span aria-hidden="true">−</span>
      </button>
      <input
        {...inputProps}
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
          onBlur?.();
        }}
        className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-center text-sm text-stone-900 focus:outline-none focus:ring-0"
      />
      <button
        type="button"
        className={`${stepperBtnClass} border-l border-stone-200`}
        aria-label={`Increase ${label}`}
        onClick={increment}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  ) : (
    <input
      {...inputProps}
      value={displayValue}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          setValue(0);
        } else {
          setValue(parseInput(raw));
        }
      }}
      onBlur={() => onBlur?.()}
      className={`${INPUT_CLASS}`}
    />
  );

  return (
    <div className="flex flex-col gap-3 text-sm">
      <label id={`${fieldId}-label`} htmlFor={fieldId} className={QUOTE_FIELD_LABEL}>
        {label}
      </label>
      {inner}
    </div>
  );
}
