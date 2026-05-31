"use client";

import { useEffect, useState } from "react";
import { proposalApi, type ProposalResponse } from "@/lib/proposalApi";

export default function EligibilityEvaluationPage() {
  const [flaggedProposals, setFlaggedProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await proposalApi.getFlagged();
        setFlaggedProposals(data);
      } catch (err) {
        console.error("Failed to fetch flagged proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: flaggedProposals.length,
    passed: flaggedProposals.filter((p) => p.skorRuleBased !== undefined && p.skorRuleBased >= 50).length,
    needsReview: flaggedProposals.filter((p) => p.skorRuleBased !== undefined && p.skorRuleBased < 50).length,
  };

  const getCompleteness = (proposal: ProposalResponse) => {
    const docComplete = proposal.kriteriaKelengkapanDokumen;
    const bidangComplete = proposal.kesesuaianBidang;
    if (docComplete && bidangComplete) return "Complete";
    return "Missing";
  };

  const getCompletenessStyle = (proposal: ProposalResponse) => {
    const complete = proposal.kriteriaKelengkapanDokumen && proposal.kesesuaianBidang;
    return complete ? "text-emerald-700" : "text-amber-700";
  };

  const getGateStyle = (skor?: number) => {
    if (!skor) return "bg-surface-container text-on-surface-variant";
    if (skor >= 100) return "bg-emerald-50 text-emerald-700";
    if (skor >= 50) return "bg-amber-50 text-amber-700";
    return "bg-error-container text-on-error-container";
  };

  const getGate = (skor?: number) => {
    if (!skor) return "Fail";
    if (skor >= 100) return "Pass";
    if (skor >= 50) return "Conditional";
    return "Fail";
  };

  return (
    <>
      <div>
        <h2 className="font-headline text-3xl font-bold text-primary">Rule-Based Screening Results</h2>
        <p className="text-sm text-on-surface-variant font-body">
          Initial automated verification of active grant applications against institutional compliance standards and
          eligibility parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Total Proposals Scanned
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.total}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Passed Initial Screening
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.passed}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Flagged for Review
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.total}
          </p>
          <p className="text-xs text-error mt-1 font-label">Manual action</p>
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low">
            <h3 className="text-xl font-headline font-bold text-primary">Comprehensive Evaluation Queue</h3>
          </div>
          <div className="px-6 py-3 space-y-2">
            {flaggedProposals.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="text-xs font-label px-3 py-2 rounded-lg bg-surface-container-low text-on-surface"
              >
                {p.penelitiName} - {p.bidangPenelitian}
              </div>
            ))}
            {loading && (
              <div className="text-xs font-label px-3 py-2 text-on-surface-variant">
                Loading...
              </div>
            )}
            {!loading && flaggedProposals.length === 0 && (
              <div className="text-xs font-label px-3 py-2 text-on-surface-variant">
                No flagged proposals
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                  <th className="px-6 py-4 text-left">Proposal ID</th>
                  <th className="px-6 py-4 text-left">Researcher Name</th>
                  <th className="px-6 py-4 text-center">Completeness</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      Loading...
                    </td>
                  </tr>
                ) : flaggedProposals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      No flagged proposals found
                    </td>
                  </tr>
                ) : (
                  flaggedProposals.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/60">
                      <td className="px-6 py-4 text-sm font-label font-bold text-primary">
                        #{row.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{row.penelitiName || "Unknown"}</td>
                      <td className={`px-6 py-4 text-center text-xs font-label ${getCompletenessStyle(row)}`}>
                        {getCompleteness(row)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">{row.skorRuleBased || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-label ${getGateStyle(row.skorRuleBased)}`}>
                          {getGate(row.skorRuleBased)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-label text-on-surface-variant">-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
            <span>Showing {flaggedProposals.length} flagged entries</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <div>
                <h4 className="font-headline text-lg font-bold text-primary">Automated Logic Updated</h4>
                <p className="text-xs text-on-surface-variant font-body mt-1">
                  Screening engine automatically evaluates proposals against institutional compliance standards.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error">priority_high</span>
              <div>
                <h4 className="font-headline text-lg font-bold text-primary">Critical Review Required</h4>
                <p className="text-xs text-on-surface-variant font-body mt-1">
                  Proposals with incomplete documentation require manual verification before disbursement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}