"use client";

import { useEffect, useState } from "react";
import { proposalApi, type ProposalStats, type ProposalResponse } from "@/lib/proposalApi";
import { hibahApi, type ProgramHibahResponse } from "@/lib/hibahApi";
import { getCurrentUser } from "@/lib/authGuard";

const getFileUrl = (url: string) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface MonthlyCount {
  month: string;
  count: number;
  pct: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ProposalStats | null>(null);
  const [recentProposals, setRecentProposals] = useState<ProposalResponse[]>([]);
  const [allProposals, setAllProposals] = useState<ProposalResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramHibahResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [statsData, proposalsData, programsData] = await Promise.all([
          proposalApi.getStats(),
          proposalApi.getAll(),
          hibahApi.getAll().catch(() => []),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setAllProposals(proposalsData);
          setRecentProposals(proposalsData.slice(0, 5));
          setPrograms(programsData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    const timer = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const monthlyData: MonthlyCount[] = (() => {
    if (allProposals.length === 0) return [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const counts: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = months[d.getMonth()];
      counts[key] = 0;
    }
    allProposals.forEach((p) => {
      const d = new Date(p.createdAt);
      const key = months[d.getMonth()];
      if (key in counts) counts[key]++;
    });
    const maxCount = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([month, count]) => ({ month, count, pct: Math.round((count / maxCount) * 100) }));
  })();

  const totalBudget = programs.reduce((sum, p) => sum + Number(p.totalDanaMaksimal), 0);

  const formatBudget = (amount: number) => {
    if (amount >= 1e12) return `Rp ${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `Rp ${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `Rp ${(amount / 1e6).toFixed(1)}M`;
    return `Rp ${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "UNDER_REVIEW":
        return "bg-secondary-container text-on-secondary-container";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "UNDER_REVIEW":
        return "Review";
      case "APPROVED":
        return "Approved";
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const DONUT_COLORS = ["#6e0000", "#c41e3a", "#e57373", "#ffab91", "#ffccbc"];
  const DONUT_RADIUS = 40;
  const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

  const donutSegments = (() => {
    if (programs.length === 0 || totalBudget === 0) return [];
    let cumulativeOffset = 0;
    return programs.slice(0, 5).map((prog) => {
      const proportion = Number(prog.totalDanaMaksimal) / totalBudget;
      const segmentLength = proportion * DONUT_CIRCUMFERENCE;
      const offset = cumulativeOffset;
      cumulativeOffset += segmentLength;
      return {
        id: prog.id,
        name: prog.namaProgram,
        proportion,
        segmentLength,
        offset,
      };
    });
  })();

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="font-headline text-3xl font-bold text-primary">
          Institutional Overview
        </h2>
        <p className="text-on-surface-variant font-body text-sm">
          Welcome back, {user?.name || "User"}. Here is the latest research activity update.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[22px]">
                description
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
              Active Proposals
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                {loading ? "..." : stats?.active ?? 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                payments
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
              Total Budget Allocated
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                {loading ? "..." : formatBudget(totalBudget)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[22px]">
                pending_actions
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
              Pending Reviews
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                {loading ? "..." : stats?.pending ?? 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl ambient-shadow border border-outline-variant/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-headline text-xl font-bold text-primary">
                Monthly Research Trends
              </h4>
              <p className="text-xs text-on-surface-variant font-body">
                Proposal volume over the last 6 months
              </p>
            </div>
          </div>
          <div className="h-64 flex flex-col justify-between">
            {loading ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-sm font-body">
                Loading...
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-sm font-body">
                Belum ada data
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between h-48 gap-3 px-2">
                  {monthlyData.map((item) => (
                    <div
                      key={item.month}
                      className="w-full h-full bg-surface-container-low rounded-t relative group"
                    >
                      <div
                        className="absolute bottom-0 w-full gradient-primary rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${item.count > 0 ? Math.max(item.pct, 4) : 0}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-label px-2 pt-4 border-t border-outline-variant/10">
                  {monthlyData.map((item) => (
                    <span key={item.month}>{item.month}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow border border-outline-variant/15 flex flex-col">
          <h4 className="font-headline text-xl font-bold text-primary mb-1">
            Budget Utilization
          </h4>
          <p className="text-xs text-on-surface-variant mb-8 font-body">
            Allocation by Department
          </p>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm font-body">
              Loading...
            </div>
          ) : programs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm font-body">
              Belum ada data
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r={DONUT_RADIUS} stroke="#eeeef0" strokeWidth="12" />
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={seg.id}
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r={DONUT_RADIUS}
                      stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                      strokeWidth="12"
                      strokeDasharray={`${seg.segmentLength} ${DONUT_CIRCUMFERENCE - seg.segmentLength}`}
                      strokeDashoffset={-seg.offset}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-headline font-bold text-primary">
                    {programs.length}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase font-label">
                    Programs
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {programs.slice(0, 5).map((prog, i) => (
                  <div key={prog.id} className="flex items-center justify-between text-xs font-label">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}></span>
                      <span className="text-on-surface font-medium">{prog.namaProgram}</span>
                    </div>
                    <span className="font-bold text-on-surface">
                      {totalBudget > 0 ? `${Math.round((Number(prog.totalDanaMaksimal) / totalBudget) * 100)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        <div className="p-8 border-b border-surface-container-low flex items-center justify-between">
          <div>
            <h4 className="font-headline text-xl font-bold text-primary">
              Recent Submissions
            </h4>
            <p className="text-xs text-on-surface-variant font-body">
              Detailed view of latest research grant applications
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                <th className="px-8 py-4">Researcher</th>
                <th className="px-8 py-4">Research Title</th>
                <th className="px-8 py-4 text-center">Submission Date</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-on-surface-variant">
                    Loading submissions...
                  </td>
                </tr>
              ) : recentProposals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-on-surface-variant">
                    No submissions found
                  </td>
                </tr>
              ) : (
                recentProposals.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold font-label shrink-0">
                          {getInitials(row.penelitiName || "UN")}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary font-headline">
                            {row.penelitiName || "Unknown"}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-body">
                            {row.bidangPenelitian}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-on-surface line-clamp-1 font-body">
                          {row.judulPenelitian}
                        </p>
                        {row.dokumenUrl && (
                          <a
                            href={getFileUrl(row.dokumenUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:opacity-80"
                            title="Download Proposal PDF"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-body">
                        Program: {row.hibahName}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center text-xs text-on-surface-variant font-label">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(row.statusProposal)} font-label`}
                      >
                        {getStatusLabel(row.statusProposal)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}