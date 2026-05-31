"use client";

import { useEffect, useState } from "react";
import { proposalApi, type ProposalResponse } from "@/lib/proposalApi";
import { hibahApi, type ProgramHibahResponse } from "@/lib/hibahApi";

export default function GrantDashboardPage() {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramHibahResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proposalsData, programsData] = await Promise.all([
          proposalApi.getAll(),
          hibahApi.getAll().catch(() => []),
        ]);
        setProposals(proposalsData);
        setPrograms(programsData);
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      case "RULE_FAILED":
        return "bg-amber-50 text-amber-700";
      case "SUBMITTED":
        return "bg-surface-container text-on-surface-variant";
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
      case "RULE_FAILED":
        return "Flagged";
      case "SUBMITTED":
        return "Pending";
      case "DRAFT":
        return "Draft";
      default:
        return status;
    }
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1e12) return `Rp ${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `Rp ${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `Rp ${(amount / 1e6).toFixed(1)}M`;
    return `Rp ${amount.toLocaleString()}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const totalProgramBudget = programs.reduce((sum, p) => sum + Number(p.totalDanaMaksimal), 0);

  const stats = {
    total: proposals.length,
    underReview: proposals.filter((p) => p.statusProposal === "UNDER_REVIEW").length,
  };

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">
            Grant Programs
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            SIPELKA Dashboard - View all research grant submissions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
            Total Proposals
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {loading ? "..." : stats.total}
          </h3>

        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
            Under Review
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {loading ? "..." : stats.underReview}
          </h3>

        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
            Total Grant Ceiling
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {loading ? "..." : formatBudget(totalProgramBudget)}
          </h3>
          <p className="text-xs mt-2 text-on-surface-variant font-label">
            Across all programs
          </p>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        <div className="p-8 border-b border-surface-container-low">
          <div>
            <h4 className="font-headline text-xl font-bold text-primary">
              Recent Submissions
            </h4>
            <p className="text-xs text-on-surface-variant font-body">
              Detailed view of latest research grant applications
            </p>
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                <th className="px-8 py-4">Investigator</th>
                <th className="px-8 py-4">Research Title</th>
                <th className="px-8 py-4">Program</th>
                <th className="px-8 py-4 text-center">Submission Date</th>
                <th className="px-8 py-4 text-right">Score</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                    Loading submissions...
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                    No submissions found
                  </td>
                </tr>
              ) : (
                proposals.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold font-label shrink-0">
                          {getInitials(row.penelitiName)}
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
                      <p className="text-sm font-medium text-on-surface line-clamp-1 font-body">
                        {row.judulPenelitian}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-xs text-on-surface-variant font-body">
                      {row.hibahName}
                    </td>
                    <td className="px-8 py-5 text-center text-xs text-on-surface-variant font-label">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-8 py-5 text-right text-xs font-semibold text-on-surface font-label">
                      {row.skorRuleBased || 0}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-label ${getStatusStyle(row.statusProposal)}`}
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
      </section>
    </>
  );
}