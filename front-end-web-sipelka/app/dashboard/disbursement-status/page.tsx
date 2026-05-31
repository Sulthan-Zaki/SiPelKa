"use client";

import { useEffect, useState } from "react";
import { pencairanApi, type PencairanDanaResponse } from "@/lib/pencairanApi";

export default function DisbursementStatusPage() {
  const [disbursements, setDisbursements] = useState<PencairanDanaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pencairanApi.getAll();
        setDisbursements(data);
      } catch (err) {
        console.error("Failed to fetch disbursements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalDisbursed: disbursements.filter((d) => d.statusPencairan === "CAIR").length,
    totalPending: disbursements.filter((d) => d.statusPencairan === "PENDING").length,
    totalProses: disbursements.filter((d) => d.statusPencairan === "PROSES").length,
    disbursedAmount: disbursements
      .filter((d) => d.statusPencairan === "CAIR")
      .reduce((sum, d) => sum + Number(d.jumlahDana), 0),
    totalAmount: disbursements.reduce((sum, d) => sum + Number(d.jumlahDana), 0),
  };

  const disbursedPercent = stats.totalAmount > 0 
    ? Math.round((stats.disbursedAmount / stats.totalAmount) * 100) 
    : 0;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CAIR":
        return "bg-emerald-50 text-emerald-700";
      case "PROSES":
        return "bg-amber-50 text-amber-700";
      case "PENDING":
        return "bg-surface-container text-on-surface-variant";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp ${amount.toLocaleString()}`;
  };

  return (
    <>
      <div>
        <h2 className="font-headline text-3xl font-bold text-primary">
          Disbursement Status Tracker
        </h2>
        <p className="text-sm text-on-surface-variant font-body">
          Financial oversight and release tracking for the current fiscal cycle.
          Monitor institutional research grants and fund allocation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Total Disbursed
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : `${disbursedPercent}%`}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-label">
            {loading ? "..." : `${formatCurrency(stats.disbursedAmount)} / ${formatCurrency(stats.totalAmount)}`}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Pending Approval
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.totalPending}
          </p>
          <p className="text-xs text-amber-700 mt-1 font-label">
            Awaiting approval
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            In Process
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            {loading ? "..." : stats.totalProses}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-label">
            Being processed
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-primary">
              Institutional Disbursement Ledger
            </h3>

          </div>
          <div className="px-6 py-3 flex flex-wrap gap-2">
            {disbursements.slice(0, 4).map((d) => (
              <span
                key={d.id}
                className="px-3 py-1 rounded-full text-xs font-label bg-surface-container-low text-on-surface"
              >
                {d.penelitiName}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                  <th className="px-6 py-4 text-left">Grant ID</th>
                  <th className="px-6 py-4 text-left">Investigator</th>
                  <th className="px-6 py-4 text-left">Research Title</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      Loading...
                    </td>
                  </tr>
                ) : disbursements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      No disbursement records found
                    </td>
                  </tr>
                ) : (
                  disbursements.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/60">
                      <td className="px-6 py-4 font-label text-sm text-primary font-bold">
                        #{row.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body">
                        {row.penelitiName}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body line-clamp-1">
                        {row.proposalTitle}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">
                        {formatCurrency(Number(row.jumlahDana))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold font-label ${getStatusStyle(row.statusPencairan)}`}
                        >
                          {row.statusPencairan}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
            <span>Showing {disbursements.length} disbursements</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low">
            <h3 className="text-xl font-headline font-bold text-primary">
              Activity Stream
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {disbursements.slice(0, 4).map((d) => (
              <div key={d.id} className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  {d.statusPencairan === "CAIR" ? "check_circle" : "sync"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface font-label">
                    {d.statusPencairan === "CAIR" ? "Payment Released" : "Status Updated"}
                  </p>
                  <p className="text-xs text-on-surface-variant font-body">
                    {formatCurrency(Number(d.jumlahDana))} for {d.penelitiName}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low" />
        </div>
      </section>
    </>
  );
}