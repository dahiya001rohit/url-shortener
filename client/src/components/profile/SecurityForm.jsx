import { useState } from "react";
import { Eye, EyeOff, Monitor } from "lucide-react";
import Card from "../shared/ui/Card";
import Button from "../shared/ui/Button";
import Toggle from "../shared/ui/Toggle";

function getStrength(pw) {
  if (pw.length < 6) return { label: "Weak", filled: 1, color: "bg-error" };
  if (pw.length < 8) return { label: "Fair", filled: 2, color: "bg-accent" };
  if (pw.length < 12) return { label: "Good", filled: 3, color: "bg-primary" };
  return { label: "Strong", filled: 4, color: "bg-green-600" };
}

function PasswordField({ id, label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 pr-12 text-sm font-mono placeholder:text-secondary/40 outline-none transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SecurityForm({ onChangePassword }) {
  const [fields, setFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [twoFA, setTwoFA] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(fields.newPassword);

  function handleField(key) {
    return (e) => setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  function toggleShow(key) {
    setShow((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Password
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Change Password
        </h3>

        <div className="space-y-4">
          <PasswordField
            id="current"
            label="Current Password"
            value={fields.currentPassword}
            onChange={handleField("currentPassword")}
            show={show.current}
            onToggle={() => toggleShow("current")}
          />
          <PasswordField
            id="new"
            label="New Password"
            value={fields.newPassword}
            onChange={handleField("newPassword")}
            show={show.new}
            onToggle={() => toggleShow("new")}
          />

          {fields.newPassword.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      n <= strength.filled ? strength.color : "bg-surface-container"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">
                Strength: {strength.label}
              </span>
            </div>
          )}

          <PasswordField
            id="confirm"
            label="Confirm New Password"
            value={fields.confirmPassword}
            onChange={handleField("confirmPassword")}
            show={show.confirm}
            onToggle={() => toggleShow("confirm")}
          />
          {fields.confirmPassword && fields.newPassword !== fields.confirmPassword && (
            <p className="text-[10px] text-error font-mono uppercase tracking-widest">
              Passwords do not match
            </p>
          )}
        </div>

        {error && (
          <p className="text-[10px] text-error font-mono uppercase tracking-widest mt-3">{error}</p>
        )}
        {success && (
          <p className="text-[10px] text-primary font-mono uppercase tracking-widest mt-3">Password updated!</p>
        )}
        <Button
          variant="primary"
          size="sm"
          className="mt-5"
          disabled={loading}
          onClick={async () => {
            if (fields.newPassword !== fields.confirmPassword) {
              setError("Passwords do not match");
              return;
            }
            if (fields.newPassword.length < 6) {
              setError("Password must be at least 6 characters");
              return;
            }
            setError("");
            setSuccess(false);
            setLoading(true);
            try {
              await onChangePassword?.(fields.currentPassword, fields.newPassword);
              setFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
              setSuccess(true);
            } catch (err) {
              setError(err.response?.data?.message || "Failed to update password");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Updating…" : "Update Password"}
        </Button>
      </Card>

      <Card>
        <Toggle
          enabled={twoFA}
          onChange={() => setTwoFA((v) => !v)}
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account."
        />
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Sessions
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Active Sessions
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center">
              <Monitor className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">
                Chrome on macOS
              </p>
              <p className="text-xs font-mono text-secondary mt-0.5">
                Current session · Mumbai, IN
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Active now
          </span>
        </div>
      </Card>
    </div>
  );
}
