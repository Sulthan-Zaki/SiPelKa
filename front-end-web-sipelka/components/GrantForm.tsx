"use client";

import { useState, useEffect } from "react";
import type { ProgramHibahResponse } from "@/lib/hibahApi";

interface GrantFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: GrantFormPayload) => Promise<void>;
  initialData?: ProgramHibahResponse | null;
  mode: "create" | "edit";
}

export interface GrantFormPayload {
  adminId?: string;
  namaProgram: string;
  deskripsi: string;
  bidangFokus: string;
  tanggalBuka: string;
  tanggalTutup: string;
  totalDanaMaksimal: number;
}

const BIDANG_FOKUS_OPTIONS = [
  "All",
  "Science",
  "Technology",
  "Engineering",
  "Mathematics",
  "Social Sciences",
  "Health",
  "Agriculture",
];

export default function GrantForm({ open, onClose, onSave, initialData, mode }: GrantFormProps) {
  const [namaProgram, setNamaProgram] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [bidangFokus, setBidangFokus] = useState("");
  const [tanggalBuka, setTanggalBuka] = useState("");
  const [tanggalTutup, setTanggalTutup] = useState("");
  const [totalDanaMaksimal, setTotalDanaMaksimal] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        setNamaProgram(initialData.namaProgram);
        setDeskripsi(initialData.deskripsi);
        setBidangFokus(initialData.bidangFokus);
        setTanggalBuka(initialData.tanggalBuka.split("T")[0]);
        setTanggalTutup(initialData.tanggalTutup.split("T")[0]);
        setTotalDanaMaksimal(String(initialData.totalDanaMaksimal));
      } else {
        setNamaProgram("");
        setDeskripsi("");
        setBidangFokus("");
        setTanggalBuka("");
        setTanggalTutup("");
        setTotalDanaMaksimal("");
      }
      setErrors({});
    }
  }, [open, initialData, mode]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!namaProgram.trim()) errs.namaProgram = "Program name is required";
    if (!deskripsi.trim()) errs.deskripsi = "Description is required";
    if (!bidangFokus) errs.bidangFokus = "Focus area is required";
    if (!tanggalBuka) errs.tanggalBuka = "Open date is required";
    if (!tanggalTutup) errs.tanggalTutup = "Close date is required";
    if (tanggalBuka && tanggalTutup && new Date(tanggalTutup) <= new Date(tanggalBuka)) {
      errs.tanggalTutup = "Close date must be after open date";
    }
    if (!totalDanaMaksimal || Number(totalDanaMaksimal) <= 0) {
      errs.totalDanaMaksimal = "Max fund amount must be greater than 0";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        namaProgram: namaProgram.trim(),
        deskripsi: deskripsi.trim(),
        bidangFokus,
        tanggalBuka: new Date(tanggalBuka).toISOString(),
        tanggalTutup: new Date(tanggalTutup).toISOString(),
        totalDanaMaksimal: Number(totalDanaMaksimal),
      });
      onClose();
    } catch {
      // Error handled by parent via toast
    } finally {
      setSaving(false);
    }
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
            {mode === "create" ? "Create Grant Program" : "Edit Grant Program"}
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
              Program Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={namaProgram}
              onChange={(e) => setNamaProgram(e.target.value)}
              placeholder="e.g., Hibah Penelitian Dasar 2026"
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.namaProgram ? "border-error" : "border-outline-variant/40"
              }`}
            />
            {errors.namaProgram && <p className="text-xs text-error mt-1 font-label">{errors.namaProgram}</p>}
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Describe the grant program objectives and scope..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary resize-none ${
                errors.deskripsi ? "border-error" : "border-outline-variant/40"
              }`}
            />
            {errors.deskripsi && <p className="text-xs text-error mt-1 font-label">{errors.deskripsi}</p>}
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Focus Area <span className="text-error">*</span>
            </label>
            <select
              value={bidangFokus}
              onChange={(e) => setBidangFokus(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.bidangFokus ? "border-error" : "border-outline-variant/40"
              }`}
            >
              <option value="">Select focus area...</option>
              {BIDANG_FOKUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.bidangFokus && <p className="text-xs text-error mt-1 font-label">{errors.bidangFokus}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
                Open Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={tanggalBuka}
                onChange={(e) => setTanggalBuka(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                  errors.tanggalBuka ? "border-error" : "border-outline-variant/40"
                }`}
              />
              {errors.tanggalBuka && <p className="text-xs text-error mt-1 font-label">{errors.tanggalBuka}</p>}
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
                Close Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={tanggalTutup}
                onChange={(e) => setTanggalTutup(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                  errors.tanggalTutup ? "border-error" : "border-outline-variant/40"
                }`}
              />
              {errors.tanggalTutup && <p className="text-xs text-error mt-1 font-label">{errors.tanggalTutup}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">
              Maximum Fund Amount (IDR) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={totalDanaMaksimal}
              onChange={(e) => setTotalDanaMaksimal(e.target.value)}
              placeholder="e.g., 50000000"
              min={1}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-sm font-body text-on-surface outline-none transition-colors focus:border-primary ${
                errors.totalDanaMaksimal ? "border-error" : "border-outline-variant/40"
              }`}
            />
            {errors.totalDanaMaksimal && <p className="text-xs text-error mt-1 font-label">{errors.totalDanaMaksimal}</p>}
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
              {saving ? "Saving..." : mode === "create" ? "Create Program" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
