"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authGuard";
import { userApi } from "@/lib/userApi";
import type { UserResponse } from "@/types/user";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [localUser, setLocalUser] = useState<UserResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  
  const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${baseUrl}${photoUrl}`;
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!localUser?.id) throw new Error("User ID not loaded.");

      // 1. Upload file to backend
      const relativeUrl = await userApi.uploadProfilePhoto(file);

      // 2. Associate with profile
      const updatedUser = await userApi.updateProfilePhoto(localUser.id, relativeUrl);

      // 3. Save to state & localStorage
      setLocalUser(updatedUser);
      localStorage.setItem("sipelka_user", JSON.stringify(updatedUser));

      // Dispatch custom event to let other mounted components react
      window.dispatchEvent(new Event("storage"));

      setSuccess("Profile photo updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload profile photo. Make sure the file is under 5MB.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-primary">Loading settings...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface p-8 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary">Settings</h1>
            <p className="text-sm text-on-surface-variant font-body mt-1">
              Manage your account preferences and dashboard behavior.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-label font-semibold text-on-surface hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 ambient-shadow">
          <h2 className="font-headline text-xl font-bold text-primary mb-6">Profile</h2>
          
          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline-variant/10 mb-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold font-label ring-4 ring-primary/5">
                {getAvatarUrl(localUser?.profilePhotoUrl) ? (
                  <img
                    src={getAvatarUrl(localUser?.profilePhotoUrl)!}
                    alt={localUser?.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(localUser?.name)
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-surface/70 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-semibold text-on-surface font-label">Profile Photo</h3>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Upload a profile picture. JPG or PNG files are supported.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary/90 shadow-md cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  Upload New Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {error && <p className="text-xs text-error font-medium mt-1">{error}</p>}
              {success && <p className="text-xs text-primary font-medium mt-1">{success}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-label">
              <span className="text-on-surface-variant">Display Name</span>
              <input
                value={localUser?.name || "User"}
                readOnly
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-on-surface opacity-70 cursor-not-allowed"
              />
            </label>
            <label className="space-y-1 text-sm font-label">
              <span className="text-on-surface-variant">Email</span>
              <input
                value={localUser?.email || "user@sipelka.ac.id"}
                readOnly
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-on-surface opacity-70 cursor-not-allowed"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 ambient-shadow">
          <h2 className="font-headline text-xl font-bold text-primary">Application</h2>
          <div className="mt-4 space-y-3">
            {[
              "Email notifications for grant updates",
              "Weekly summary report",
              "Show compact tables in dashboard",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface p-3"
              >
                <span className="text-sm font-label text-on-surface">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-label text-on-surface cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
