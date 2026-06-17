"use client";

import { useEffect, useState, useCallback } from "react";
import { proposalApi, type ProposalResponse } from "@/lib/proposalApi";
import { hibahApi, type ProgramHibahResponse } from "@/lib/hibahApi";
import GrantForm, { type GrantFormPayload } from "@/components/GrantForm";
import { useToast } from "@/components/Toast";
import { getCurrentUser } from "@/lib/authGuard";

const getFileUrl = (url: string) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function GrantDashboardPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramHibahResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProgram, setEditingProgram] = useState<ProgramHibahResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProgramHibahResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [proposalsData, programsData] = await Promise.all([
        proposalApi.getAll(),
        hibahApi.getAll().catch(() => [] as ProgramHibahResponse[]),
      ]);
      setProposals(proposalsData);
      setPrograms(programsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingProgram(null);
    setFormOpen(true);
  };

  const openEditForm = (program: ProgramHibahResponse) => {
    setFormMode("edit");
    setEditingProgram(program);
    setFormOpen(true);
  };

  const handleSave = async (payload: GrantFormPayload) => {
    setSaving(true);
    try {
      const user = getCurrentUser();
      const adminId = user?.id;
      if (!adminId) {
        toast("User not authenticated", "error");
        return;
      }
      const payloadWithAdmin = { ...payload, adminId };
      if (formMode === "create") {
        await hibahApi.createProgram(payloadWithAdmin);
        toast("Grant program created successfully", "success");
      } else if (editingProgram) {
        await hibahApi.updateProgram(editingProgram.id, payload);
        toast("Grant program updated successfully", "success");
      }
      await fetchData();
    } catch (err) {
      console.error("Failed to save grant program:", err);
      toast("Failed to save grant program", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await hibahApi.deleteProgram(deleteConfirm.id);
      toast("Grant program deleted successfully", "success");
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete grant program:", err);
      toast("Failed to delete grant program", "error");
    }
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

  const now = new Date();
  const totalProgramBudget = programs.reduce((sum, p) => sum + Number(p.totalDanaMaksimal), 0);
  const activePrograms = programs.filter(
    (p) => new Date(p.tanggalBuka) <= now && new Date(p.tanggalTutup) >= now
  ).length;

  const stats = {
    total: proposals.length,
    underReview: proposals.filter((p) => p.statusProposal === "UNDER_REVIEW").length,
  };

  return (
    <>
      <GrantForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProgram(null); }}
        onSave={handleSave}
        initialData={editingProgram}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-error text-[28px]">warning</span>
              <h3 className="text-lg font-headline font-bold text-primary">Delete Grant Program</h3>
            </div>
            <p className="text-sm text-on-surface-variant font-body mb-2">
              Are you sure you want to delete <strong>{deleteConfirm.namaProgram}</strong>?
            </p>
            <p className="text-xs text-on-surface-variant font-label mb-6">
              This action cannot be undone. Proposals linked to this program will not be affected.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-label font-semibold text-on-error bg-error hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">
            Grant Programs
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            SIPELKA Dashboard - Manage funding categories, deadlines, and submissions
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-label font-semibold text-on-primary gradient-primary hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Grant Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
            Total Programs
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {loading ? "..." : programs.length}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
            Active Programs
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {loading ? "..." : activePrograms}
          </h3>
        </div>
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

      {/* Grant Programs Table */}
      <section className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        <div className="p-6 border-b border-surface-container-low">
          <h4 className="font-headline text-xl font-bold text-primary">
            Funding Categories
          </h4>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Manage grant programs, deadlines, and fund allocations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                <th className="px-6 py-4 text-left">Program Name</th>
                <th className="px-6 py-4 text-left">Focus Area</th>
                <th className="px-6 py-4 text-center">Open Date</th>
                <th className="px-6 py-4 text-center">Close Date</th>
                <th className="px-6 py-4 text-right">Max Fund</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-label">
                    Loading programs...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-label">
                    No grant programs yet. Click &quot;Create Grant Program&quot; to get started.
                  </td>
                </tr>
              ) : (
                programs.map((program) => {
                  const isActive = now >= new Date(program.tanggalBuka) && now <= new Date(program.tanggalTutup);
                  const isUpcoming = now < new Date(program.tanggalBuka);
                  return (
                    <tr key={program.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-primary font-headline">{program.namaProgram}</p>
                        <p className="text-[10px] text-on-surface-variant font-body line-clamp-1">{program.deskripsi}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant font-label">{program.bidangFokus}</td>
                      <td className="px-6 py-4 text-center text-xs text-on-surface font-label">{formatDate(program.tanggalBuka)}</td>
                      <td className="px-6 py-4 text-center text-xs text-on-surface font-label">{formatDate(program.tanggalTutup)}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold font-label">{formatBudget(Number(program.totalDanaMaksimal))}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-label ${
                          isActive ? "bg-emerald-50 text-emerald-700" :
                          isUpcoming ? "bg-amber-50 text-amber-700" :
                          "bg-surface-container text-on-surface-variant"
                        }`}>
                          {isActive ? "Active" : isUpcoming ? "Upcoming" : "Closed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditForm(program)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="Edit program"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(program)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Delete program"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Proposals Table */}
      <section className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        <div className="p-6 border-b border-surface-container-low">
          <h4 className="font-headline text-xl font-bold text-primary">
            Recent Submissions
          </h4>
          <p className="text-xs text-on-surface-variant font-body">
            Detailed view of latest research grant applications
          </p>
        </div>

        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                <th className="px-8 py-4">Researcher</th>
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
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant font-label">
                    Loading submissions...
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant font-label">
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
