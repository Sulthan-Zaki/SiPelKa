"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/authGuard";

export default function SettingsPage() {
  const router = useRouter();
  const user = getCurrentUser();

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
          <h2 className="font-headline text-xl font-bold text-primary">Profile</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-label">
              <span className="text-on-surface-variant">Display Name</span>
              <input
                defaultValue={user?.name || "User"}
                readOnly
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-on-surface opacity-70 cursor-not-allowed"
              />
            </label>
            <label className="space-y-1 text-sm font-label">
              <span className="text-on-surface-variant">Email</span>
              <input
                defaultValue={user?.email || "user@sipelka.ac.id"}
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
