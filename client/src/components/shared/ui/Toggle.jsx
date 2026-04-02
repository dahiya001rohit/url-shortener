export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-outline-variant/20 last:border-b-0">
      {(label || description) && (
        <div className="flex-1 pr-4">
          {label && (
            <p className="text-sm font-body font-medium text-foreground">
              {label}
            </p>
          )}
          {description && (
            <p className="text-xs font-body text-secondary mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={!disabled ? onChange : undefined}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          disabled
            ? "bg-outline-variant cursor-not-allowed"
            : enabled
            ? "bg-primary"
            : "bg-surface-container-high"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
