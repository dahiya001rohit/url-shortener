import { useState } from "react";

export default function PersonalInfoForm({ user, onSave }) {
  const initial = {
    name: user.name,
    email: user.email,
    bio: "Digital curator and minimalist designer. Organizing the web, one snip at a time.",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initial);

  function handleChange(e) {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    onSave?.(formData);
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData(initial);
    setIsEditing(false);
  }

  const inputClass = (editing) =>
    `w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all ${
      editing
        ? "bg-surface-container-lowest border border-outline-variant focus:ring-1 focus:ring-primary"
        : "bg-surface-container-low border-0 text-secondary cursor-default"
    }`;

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
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
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-mono uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass(isEditing)}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={inputClass(isEditing)}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
            className={`${inputClass(isEditing)} resize-none`}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide bg-primary text-on-primary hover:bg-primary-container transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide bg-surface-container text-secondary hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
