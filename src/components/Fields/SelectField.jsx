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
        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
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
