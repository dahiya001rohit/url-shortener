import { useState, useEffect } from "react";
import Card from "../shared/ui/Card";
import Input from "../shared/ui/Input";
import Button from "../shared/ui/Button";

export default function PersonalInfoForm({ user, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: "Digital curator and minimalist designer. Organizing the web, one snip at a time.",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user.name, user.email, isEditing]);

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
    setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
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
        <Input
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          rows={3}
        />
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
