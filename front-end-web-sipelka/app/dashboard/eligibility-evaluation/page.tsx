"use client";

import { useEffect, useState, useCallback } from "react";
import { proposalApi, type ProposalResponse } from "@/lib/proposalApi";
import { useToast } from "@/components/Toast";

const getFileUrl = (url: string) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function EligibilityEvaluationPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [notesModal, setNotesModal] = useState<{ id: string; action: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await proposalApi.getFlagged();
      setProposals(data);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      toast("Failed to load proposal data", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: string, status: string) => {
    setActionId(id);
    try {
      await proposalApi.updateStatus(id, status, reviewNotes || undefined);
      toast(`Proposal ${status === "APPROVED" ? "approved" : "rejected"} successfully`, "success");
      setNotesModal(null);
      setReviewNotes("");
      await fetchData();
    } catch (err) {
      console.error("Failed to update proposal status:", err);
      toast("Failed to update proposal status", "error");
    } finally {
      setActionId(null);
    }
  };

  const openActionModal = (id: string, action: string) => {
    setNotesModal({ id, action });
    setReviewNotes("");
  };

  const stats = {
    total: proposals.length,
    readyForReview: proposals.filter((p) => p.skorRuleBased !== undefined && p.skorRuleBased >= 70).length,
    highPriority: proposals.filter((p) => p.skorRuleBased !== undefined && p.skorRuleBased < 70).length,
  };

  const getPriorityStyle = (skor?: number) => {
    if (!skor && skor !== 0) return "bg-surface-container text-on-surface-variant";
    if (skor >= 80) return "bg-emerald-50 text-emerald-700";
    if (skor >= 50) return "bg-amber-50 text-amber-700";
    return "bg-error-container text-on-error-container";
  };

  const getPriority = (skor?: number) => {
    if (!skor && skor !== 0) return "N/A";
    if (skor >= 80) return "High";
    if (skor >= 50) return "Medium";
    return "Low";
  };

  return (
    <>
      {/* Review Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setNotesModal(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-headline font-bold text-primary mb-2">
              {notesModal.action === "APPROVED" ? "Approve Proposal" : "Reject Proposal"}
            </h3>
            <p className="text-sm text-on-surface-variant font-body mb-4">
              {notesModal.action === "APPROVED"
                ? "Approve this proposal and move it to the next stage."
                : "Reject this proposal. The researcher will be notified."}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes or reason for this decision..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm font-body text-on-surface outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setNotesModal(null); setReviewNotes(""); }}
                className="px-4 py-2 rounded-xl text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(notesModal.id, notesModal.action)}
                disabled={actionId === notesModal.id}
                className={`px-4 py-2 rounded-xl text-sm font-label font-semibold text-on-primary transition-opacity disabled:opacity-50 cursor-pointer ${
                  notesModal.action === "APPROVED" ? "bg-emerald-700" : "bg-error"
                }`}
              >
                {actionId === notesModal.id ? "Processing..." :
                 notesModal.action === "APPROVED" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-headline text-3xl font-bold text-primary">Proposal Screening Results</h2>
        <p className="text-sm text-on-surface-variant font-body">
          Automated screening of submitted proposals against institutional compliance standards and
          eligibility parameters. Review and take action on each proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Total Proposals Under Review
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.total}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Ready for Review
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.readyForReview}
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-label">Score &gt;= 70</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            High Priority
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.highPriority}
          </p>
          <p className="text-xs text-error mt-1 font-label">Score &lt; 70, needs attention</p>
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low">
            <h3 className="text-xl font-headline font-bold text-primary">Evaluation Queue</h3>
          </div>
          <div className="px-6 py-3 space-y-2">
            {proposals.slice(0, 3).map((p) => (
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
            {!loading && proposals.length === 0 && (
              <div className="text-xs font-label px-3 py-2 text-on-surface-variant">
                No proposals under review
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                  <th className="px-6 py-4 text-left">Proposal ID</th>
                  <th className="px-6 py-4 text-left">Researcher Name</th>
                  <th className="px-6 py-4 text-left">Research Title</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant font-label">
                      Loading...
                    </td>
                  </tr>
                ) : proposals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant font-label">
                      No proposals under review
                    </td>
                  </tr>
                ) : (
                  proposals.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/60">
                      <td className="px-6 py-4 text-sm font-label font-bold text-primary">
                        #{row.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{row.penelitiName || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1">{row.judulPenelitian}</span>
                          {row.dokumenUrl && (
                            <a
                              href={getFileUrl(row.dokumenUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary hover:opacity-80 shrink-0"
                              title="Download Proposal PDF"
                            >
                              <span className="material-symbols-outlined text-[18px]">download</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">{row.skorRuleBased ?? 0}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-label whitespace-nowrap ${getPriorityStyle(row.skorRuleBased)}`}>
                          {getPriority(row.skorRuleBased)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openActionModal(row.id, "APPROVED")}
                            disabled={actionId === row.id}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-label bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(row.id, "REJECTED")}
                            disabled={actionId === row.id}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-label bg-error-container text-on-error-container hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
            <span>Showing {proposals.length} proposals under review</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <div>
                <h4 className="font-headline text-lg font-bold text-primary">Automated Screening</h4>
                <p className="text-xs text-on-surface-variant font-body mt-1">
                  Each proposal is automatically scored based on document completeness, researcher eligibility, past performance, and active grant limits.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">info</span>
              <div>
                <h4 className="font-headline text-lg font-bold text-primary">Priority Levels</h4>
                <p className="text-xs text-on-surface-variant font-body mt-1">
                  <strong>High</strong> (80-100): Strong proposal. <strong>Medium</strong> (50-79): Needs attention. <strong>Low</strong> (0-49): Multiple issues detected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
