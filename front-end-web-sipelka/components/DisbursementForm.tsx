"use client";

import { useState, useEffect } from "react";
import type { CreatePencairanPayload } from "@/lib/pencairanApi";
import type { ProposalResponse } from "@/lib/proposalApi";

interface DisbursementFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreatePencairanPayload) => Promise<void>;
  approvedProposals: ProposalResponse[];
}

export default function DisbursementForm({ open, onClose, onSave, approvedProposals }: DisbursementFormProps) {
  const [proposalId, setProposalId] = useState("");
  const [tahapPencairan, setTahapPencairan] = useState("1");
  const [jumlahDana, setJumlahDana] = useState("");
  const [buktiTransferUrl, setBuktiTransferUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setProposalId("");
      setTahapPencairan("1");
      setJumlahDana("");
      setBuktiTransferUrl("");
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!proposalId) errs.proposalId = "Proposal is required";
    if (!tahapPencairan || Number(tahapPencairan) < 1) errs.tahapPencairan = "Stage must be at least 1";
    if (!jumlahDana || Number(jumlahDana) <= 0) errs.jumlahDana = "Amount must be greater than 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        proposalId,
        adminId: "",
        tahapPencairan: Number(tahapPencairan),
        jumlahDana: Number(jumlahDana),
        buktiTransferUrl: buktiTransferUrl.trim() || undefined,
      });
      onClose();
    } catch {
      // Error handled by parent via toast
    } finally {
      setSaving(false);
    }
  };

  const formatRupiah = (value: string) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return `Rp ${num.toLocaleString()}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-container-low">
          <h3 className="text-xl font-headline font-bold text-primary">
            Create Disbursement
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Proposal <span className="text-error">*</span>
            </label>
            <select
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.proposalId ? "border-error" : "border-outline-variant/40"
              }`}
            >
              <option value="">Select approved proposal...</option>
              {approvedProposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.penelitiName} - {p.judulPenelitian}
                </option>
              ))}
            </select>
            {errors.proposalId && <p className="text-xs text-error mt-1 font-label">{errors.proposalId}</p>}
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Stage Number <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={tahapPencairan}
              onChange={(e) => setTahapPencairan(e.target.value)}
              placeholder="e.g., 1"
              min={1}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.tahapPencairan ? "border-error" : "border-outline-variant/40"
              }`}
            />
            {errors.tahapPencairan && <p className="text-xs text-error mt-1 font-label">{errors.tahapPencairan}</p>}
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Amount (IDR) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={jumlahDana}
              onChange={(e) => setJumlahDana(e.target.value)}
              placeholder="e.g., 50000000"
              min={1}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.jumlahDana ? "border-error" : "border-outline-variant/40"
              }`}
            />
            {jumlahDana && Number(jumlahDana) > 0 && (
              <p className="text-xs text-on-surface-variant mt-1 font-label">
                {formatRupiah(jumlahDana)}
              </p>
            )}
            {errors.jumlahDana && <p className="text-xs text-error mt-1 font-label">{errors.jumlahDana}</p>}
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Transfer Proof URL <span className="text-on-surface-variant">(optional)</span>
            </label>
            <input
              type="text"
              value={buktiTransferUrl}
              onChange={(e) => setBuktiTransferUrl(e.target.value)}
              placeholder="https://example.com/bukti-transfer.pdf"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-low">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-label font-semibold text-on-primary gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Creating..." : "Create Disbursement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
