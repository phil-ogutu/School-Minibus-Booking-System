"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [mobile, setMobile] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(
    session?.user?.image || "/fallback-avatar.png"
  );

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setMobile(data.mobile || "");
        setPreview(data.photo_url || "/fallback-avatar.png");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("mobile", mobile);
    if (photo) body.append("photo", photo);

    const res = await fetch("/api/users/me", { method: "PUT", body });
    if (res.ok) {
      await update();
      alert("Saved!");
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Edit Profile" />
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={preview}
              alt="avatar"
              className="w-20 h-20 rounded-full border object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhoto(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="text-sm"
            />
          </div>

          <input
            className="w-full p-2 border rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Mobile"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <button
            type="submit"
            className="bg-[#0F333F] text-white px-4 py-2 rounded hover:bg-[#0A252F]"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
