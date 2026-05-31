"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/userApi";
import type { UserResponse } from "@/types/user";

export default function ResearcherDataPage() {
  const [researchers, setResearchers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsers = await userApi.getAllUsers();
        setResearchers(allUsers.filter((u) => u.role === "RESEARCHER"));
      } catch (err) {
        console.error("Failed to fetch researchers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: researchers.length,
    activated: researchers.filter((r) => r.isActivated).length,
    pending: researchers.filter((r) => !r.isActivated).length,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div>
        <h2 className="font-headline text-3xl font-bold text-primary">
          Researcher Data Directory
        </h2>
        <p className="text-sm text-on-surface-variant font-body">
          Centralized directory of eligible academic personnel and research
          performance metrics.
        </p>
      </div>

      <section className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-on-surface-variant font-label">
          Total: {loading ? "..." : stats.total} Records
        </span>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Total Researchers
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.total}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-label">
            Registered in system
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Active Researchers
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.activated}
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-label">
            Can submit proposals
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Pending Activation
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.pending}
          </p>
          <p className="text-xs text-amber-700 mt-1 font-label">
            Awaiting approval
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            H-Index Average
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            --
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-label">
            Belum ada data
          </p>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
        <div className="p-6 border-b border-surface-container-low">
          <h3 className="text-xl font-headline font-bold text-primary">
            Researcher Directory
          </h3>
        </div>
        <div className="px-6 py-3 flex flex-wrap gap-2">
          {researchers.slice(0, 5).map((person) => (
            <span
              key={person.id}
              className="px-3 py-1 rounded-full text-xs font-label bg-surface-container-low text-on-surface"
            >
              {person.name}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                <th className="px-6 py-4 text-left">Researcher</th>
                <th className="px-6 py-4 text-left">NIP</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
                {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    Loading...
                  </td>
                </tr>
              ) : researchers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    No researchers found
                  </td>
                </tr>
              ) : (
                researchers.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-label">
                          {getInitials(row.name)}
                        </div>
                        <p className="text-sm font-headline font-bold text-primary">
                          {row.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface font-body">
                      {row.nip || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface font-body">
                      {row.email}
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      <span className={`px-3 py-1 rounded-full font-label font-bold ${
                        row.isActivated 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {row.isActivated ? "Active" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
          <span>Showing {researchers.length} researchers</span>
        </div>
      </section>
    </>
  );
}