import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import AuthInput from "./AuthInput";
import AuthDivider from "./AuthDivider";
import GoogleButton from "./GoogleButton";

const PASSWORD_STRENGTH = [
  { min: 0,  label: "Too short", filled: 1 },
  { min: 6,  label: "Weak",      filled: 2 },
  { min: 8,  label: "Moderate",  filled: 3 },
  { min: 12, label: "Strong",    filled: 4 },
];

function getStrength(pw) {
  for (let i = PASSWORD_STRENGTH.length - 1; i >= 0; i--)
    if (pw.length >= PASSWORD_STRENGTH[i].min) return PASSWORD_STRENGTH[i];
  return PASSWORD_STRENGTH[0];
}

/** variant = "login" | "register" */
export default function AuthForm({ variant = "login", onSubmit }) {
  const isLogin = variant === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(isLogin ? { email: form.email, password: form.password } : form);
  };

  const strength = getStrength(form.password);

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-4xl font-headline italic text-primary">
          {isLogin ? "Welcome back." : "Create your account."}
        </h1>
        <p className="text-secondary font-body text-sm">
          {isLogin
            ? "Enter your credentials to manage your curation."
            : "Start your curated collection today."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name — register only */}
        {!isLogin && (
          <AuthInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
          />
        )}

        {/* Email */}
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder={isLogin ? "you@example.com" : "curator@snip.it"}
          required
          value={form.email}
          onChange={handleChange}
        />

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-xs font-mono uppercase tracking-widest text-secondary" htmlFor="password">
              Password
            </label>
            {isLogin && (
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-tertiary-container hover:text-primary transition-colors">
                Forgot?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 pr-12 text-base font-mono placeholder:text-outline/30 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength bar — register only */}
          {!isLogin && form.password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      n <= strength.filled ? "bg-primary" : "bg-primary/15"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest">
                Strength: {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password — register only */}
        {!isLogin && (
          <div className="space-y-1">
            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-[10px] text-error font-mono uppercase tracking-widest pt-1">
                Passwords do not match
              </p>
            )}
          </div>
        )}

        {/* Terms — register only */}
        {!isLogin && (
          <div className="flex items-start gap-3 py-1">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 border-outline-variant text-primary focus:ring-primary rounded-sm shrink-0"
            />
            <label htmlFor="terms" className="text-sm text-on-surface-variant font-body leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-primary underline underline-offset-4 hover:text-on-tertiary-container transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary underline underline-offset-4 hover:text-on-tertiary-container transition-colors">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        )}

        {/* Submit + Google */}
        <div className="flex flex-col gap-4 pt-2">
          <button
            type="submit"
            className="w-full bg-primary text-white py-4 px-8 rounded-full flex items-center justify-between group hover:bg-on-primary-fixed-variant transition-all duration-300"
          >
            <span className="text-xs font-mono uppercase tracking-widest font-medium">
              {isLogin ? "Sign In" : "Create Account"}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <AuthDivider />
          <GoogleButton />
        </div>
      </form>

      {/* Switch page link */}
      <p className="text-secondary text-sm text-center md:text-left">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          to={isLogin ? "/register" : "/login"}
          className="text-primary font-bold ml-2 inline-flex items-center gap-1 group uppercase tracking-widest text-xs"
        >
          {isLogin ? "Sign up" : "Sign in"}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </p>
    </div>
  );
}
