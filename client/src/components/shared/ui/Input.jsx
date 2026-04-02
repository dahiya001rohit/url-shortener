export default function Input({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder,
  error,
  hint,
  rightElement,
  name,
  id,
  required,
  rows,
  className = "",
}) {
  const inputClass = `w-full rounded-xl px-4 py-3 font-mono text-sm outline-none transition-all placeholder:text-outline/40 ${
    disabled
      ? "bg-surface-low cursor-not-allowed text-secondary border border-outline-variant/30"
      : error
      ? "bg-white border border-error focus:ring-2 focus:ring-error/20"
      : "bg-white border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
  } ${rightElement ? "pr-10" : ""} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block font-mono text-xs uppercase tracking-widest text-outline mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {rows ? (
          <textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`${inputClass} resize-none`}
          />
        ) : (
          <input
            id={id || name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            className={inputClass}
          />
        )}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-error mt-1 font-mono">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-outline mt-1 font-mono">{hint}</p>
      )}
    </div>
  );
}
