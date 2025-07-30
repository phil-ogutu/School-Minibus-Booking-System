"use client";
import { useState } from "react";

export default function ProfileForm({
  initial = {},
  onSave, // (formData) => Promise<void>
  fields = ["username", "email", "mobile"],
}) {
  const [form, setForm] = useState({
    username: initial.username || "",
    email: initial.email || "",
    mobile: initial.mobile || "",
    photo: null,
  });

  const [preview, setPreview] = useState(
    initial.photo_url || "/fallback-avatar.png"
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files?.[0];
      if (file) {
        setForm({ ...form, photo: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.keys(form).forEach((k) => form[k] && body.append(k, form[k]));
    await onSave(body);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {/* Avatar */}
      <div className="flex items-center space-x-4">
        <img
          src={preview}
          alt="avatar"
          className="w-20 h-20 rounded-full border object-cover"
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="text-sm"
        />
      </div>

      {/* Dynamic fields */}
      {fields.includes("username") && (
        <input
          name="username"
          placeholder="Full Name"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {fields.includes("email") && (
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {fields.includes("mobile") && (
        <input
          name="mobile"
          placeholder="Mobile"
          type="tel"
          value={form.mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-[#0A252F]"
      >
        Save Changes
      </button>
    </form>
  );
}
