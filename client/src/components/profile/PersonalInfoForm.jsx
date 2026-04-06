import { useState, useEffect } from "react";
import Card from "../shared/ui/Card";
import Input from "../shared/ui/Input";
import Button from "../shared/ui/Button";

export default function PersonalInfoForm({ user, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user?.name, user?.email, user?.bio]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await onSave?.(formData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
    setError("");
    setIsEditing(false);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-secondary">
            Personal
          </p>
          <h3 className="text-xl font-headline italic text-foreground mt-0.5">
            Personal Information
          </h3>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setSuccess(false); }}>
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-outline mb-1.5 block">
            Bio
          </label>
          <textarea
            rows={3}
            name="bio"
            disabled={!isEditing}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell the world about yourself..."
            className={`w-full rounded-xl px-4 py-3 font-body text-sm resize-none transition-all duration-200 ${
              isEditing
                ? "bg-white border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
                : "bg-surface-container cursor-not-allowed text-secondary border border-transparent"
            }`}
          />
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-error font-mono uppercase tracking-widest mt-3">{error}</p>
      )}
      {success && !isEditing && (
        <p className="text-[10px] text-primary font-mono uppercase tracking-widest mt-3">Changes saved!</p>
      )}

      {isEditing && (
        <div className="flex gap-3 mt-5">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
