import { QUOTE_FIELD_LABEL } from "../../helpers/typography.js";
import { quoteFieldId } from "../../helpers/fieldIds.js";

export default function SelectField({
  label,
  value,
  setValue,
  options,
  id,
  describedBy,
  labelledBy,
}) {
  const fieldId = id ?? (label ? quoteFieldId(label) : undefined);

  return (
    <div className="block text-sm">
      {label && (
        <label id={fieldId ? `${fieldId}-label` : undefined} htmlFor={fieldId} className={QUOTE_FIELD_LABEL}>
          {label}
        </label>
      )}
      <select
        id={fieldId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-labelledby={labelledBy ?? (label && fieldId ? `${fieldId}-label` : undefined)}
        aria-describedby={describedBy}
        className="mt-2 w-full appearance-none rounded-xl border border-stone-200 bg-white bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
