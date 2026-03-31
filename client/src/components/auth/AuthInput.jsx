import { forwardRef } from "react";

/**
 * Labeled input field — consistent across login & register.
 * Supports an optional `suffix` slot (e.g. show/hide button, "Forgot?" link).
 */
const AuthInput = forwardRef(function AuthInput(
  { id, label, suffix, className = "", ...props },
  ref
) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label
          htmlFor={id}
          className="text-xs font-mono uppercase tracking-widest text-secondary block"
        >
          {label}
        </label>
        {suffix}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={`w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-base font-mono placeholder:text-outline/30 transition-all outline-none ${className}`}
          {...props}
        />
      </div>
    </div>
  );
});

export default AuthInput;
