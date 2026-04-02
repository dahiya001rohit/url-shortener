import { useState } from "react";
import Card from "../shared/ui/Card";
import Input from "../shared/ui/Input";
import Button from "../shared/ui/Button";

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
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
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

      {isEditing && (
        <div className="flex gap-3 mt-5">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
