import Link from "next/link";

type Disbursement = {
  id: string;
  researcher: string;
  approved: string;
  disbursed: string;
  status: "Disbursed" | "Partial" | "Pending";
};

const disbursements: Disbursement[] = [
  {
    id: "GR-2024-001",
    researcher: "Dr. Marcus Vane",
    approved: "$450,000",
    disbursed: "$450,000",
    status: "Disbursed",
  },
  {
    id: "GR-2024-012",
    researcher: "Dr. Elena Ross",
    approved: "$1.2M",
    disbursed: "$600,000",
    status: "Partial",
  },
  {
    id: "GR-2024-045",
    researcher: "Prof. Liam Sato",
    approved: "$85,000",
    disbursed: "$0",
    status: "Pending",
  },
  {
    id: "GR-2024-089",
    researcher: "Dr. Sarah Chen",
    approved: "$2.5M",
    disbursed: "$1.8M",
    status: "Partial",
  },
];

const statusStyles: Record<Disbursement["status"], string> = {
  Disbursed: "bg-emerald-50 text-emerald-700",
  Partial: "bg-amber-50 text-amber-700",
  Pending: "bg-surface-container text-on-surface-variant",
};

export default function DisbursementStatusPage() {
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

      <div className="flex flex-wrap gap-3">
        <button className="gradient-primary text-on-primary px-4 py-2 rounded-lg text-sm font-label font-semibold">
          Export Report
        </button>
        <button className="bg-surface-container-low border border-outline-variant/25 text-on-surface px-4 py-2 rounded-lg text-sm font-label font-semibold">
          Update Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Total Disbursed
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            84%
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-label">
            $12,480,000 / $15.0M
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Pending Approval
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            24
          </p>
          <p className="text-xs text-amber-700 mt-1 font-label">
            +18 average approval time: 3.2 days
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
            Active Audits
          </p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            06
          </p>
          <p className="text-xs text-error mt-1 font-label">
            2 critical - verification required for Tier 1 grants
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-primary">
              Institutional Disbursement Ledger
            </h3>
            <div className="flex gap-2 text-on-surface-variant">
              <button className="p-2 rounded-lg hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px]">
                  filter_list
                </span>
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px]">
                  more_vert
                </span>
              </button>
            </div>
          </div>
          <div className="px-6 py-3 flex flex-wrap gap-2">
            {[
              "Dr. Marcus Vane",
              "Dr. Elena Ross",
              "Prof. Liam Sato",
              "Dr. Sarah Chen",
            ].map((p) => (
              <span
                key={p}
                className="px-3 py-1 rounded-full text-xs font-label bg-surface-container-low text-on-surface"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                  <th className="px-6 py-4 text-left">Grant ID</th>
                  <th className="px-6 py-4 text-left">Investigator</th>
                  <th className="px-6 py-4 text-right">Total Award</th>
                  <th className="px-6 py-4 text-right">Disbursed</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {disbursements.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/60">
                    <td className="px-6 py-4 font-label text-sm text-primary font-bold">
                      #{row.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface font-body">
                      {row.researcher}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      {row.approved}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      {row.disbursed}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-label ${statusStyles[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
            <span>Showing 4 of 128 disbursements</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded border border-outline-variant/25">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>
              <button className="px-2 py-1 rounded border border-outline-variant/25">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low">
            <h3 className="text-xl font-headline font-bold text-primary">
              Activity Stream
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                icon: "check_circle",
                title: "Payment Released",
                desc: "$45,000 sent to Biomedical Lab A",
                time: "Today 09:14 AM",
              },
              {
                icon: "info",
                title: "Audit Initiated",
                desc: "Grant #GR-2024-001 flagged for review",
                time: "Yesterday 04:30 PM",
              },
              {
                icon: "sync",
                title: "Status Updated",
                desc: "Partial disbursement for Oncology Research",
                time: "2 Days Ago 11:22 AM",
              },
              {
                icon: "history",
                title: "Archived Records",
                desc: "FY2023 Q4 disbursement report locked",
                time: "Mar 12 02:15 PM",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface font-label">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant font-body">
                    {item.desc}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/80 font-label mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low">
            <button className="text-primary text-sm font-label font-semibold hover:underline">
              View Institutional Archive
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

