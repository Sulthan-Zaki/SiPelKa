import Link from "next/link";

type Evaluation = {
  proposalId: string;
  researcher: string;
  score: number;
  gate: "Pass" | "Conditional" | "Fail";
};

const evaluations: Evaluation[] = [
  { proposalId: "PRP-2024-0891", researcher: "Prof. Adrian Mulyadi", score: 94, gate: "Pass" },
  { proposalId: "PRP-2024-1002", researcher: "Dr. Helena Sitorus", score: 42, gate: "Conditional" },
  { proposalId: "PRP-2024-0755", researcher: "Lukas Wijaya, M.Sc.", score: 78, gate: "Conditional" },
];

export default function EligibilityEvaluationPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-6 px-4">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[22px]">account_balance</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-primary font-headline">SIPELKA</h1>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-label">
              Institutional Portal
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {[
            { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
            { icon: "account_balance_wallet", label: "Grant Programs", href: "/dashboard/grant" },
            { icon: "database", label: "Researcher Data", href: "/dashboard/researcher-data" },
            { icon: "payments", label: "Disbursement Status", href: "/dashboard/disbursement-status" },
            {
              icon: "fact_check",
              label: "Eligibility Evaluation",
              href: "/dashboard/eligibility-evaluation",
              active: true,
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-label text-sm font-semibold ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-0.5">
          {[
            { icon: "settings", label: "Settings", href: "/settings" },
            { icon: "logout", label: "Logout", href: "/" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8 space-y-8">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">Rule-Based Screening Results</h2>
          <p className="text-sm text-on-surface-variant font-body">
            Initial automated verification of active grant applications against institutional compliance standards and
            eligibility parameters.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="bg-surface-container-low border border-outline-variant/25 px-4 py-2 rounded-lg text-sm font-label text-on-surface">
            Filter Results
          </button>
          <button className="gradient-primary text-on-primary px-4 py-2 rounded-lg text-sm font-label font-semibold">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
              Total Proposals Scanned
            </p>
            <p className="text-3xl font-headline font-extrabold text-primary mt-2">1,284</p>
            <p className="text-xs text-emerald-700 mt-1 font-label">+12% vs last month</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
              Passed Initial Screening
            </p>
            <p className="text-3xl font-headline font-extrabold text-primary mt-2">1,102</p>
            <p className="text-xs text-emerald-700 mt-1 font-label">85.8%</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
              Flagged for Review
            </p>
            <p className="text-3xl font-headline font-extrabold text-primary mt-2">182</p>
            <p className="text-xs text-error mt-1 font-label">Manual action</p>
          </div>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
            <div className="p-6 border-b border-surface-container-low">
              <h3 className="text-xl font-headline font-bold text-primary">Comprehensive Evaluation Queue</h3>
            </div>
            <div className="px-6 py-3 space-y-2">
              {[
                "Prof. Adrian Mulyadi - Quantum Physics Dept.",
                "Dr. Helena Sitorus - Biotechnology Center",
                "Lukas Wijaya, M.Sc. - Renewable Energy Lab",
              ].map((entry) => (
                <div
                  key={entry}
                  className="text-xs font-label px-3 py-2 rounded-lg bg-surface-container-low text-on-surface"
                >
                  {entry}
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                    <th className="px-6 py-4 text-left">Proposal ID</th>
                    <th className="px-6 py-4 text-left">Researcher Name</th>
                    <th className="px-6 py-4 text-center">Completeness</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {evaluations.map((row) => (
                    <tr key={row.proposalId} className="hover:bg-surface-container-low/60">
                      <td className="px-6 py-4 text-sm font-label font-bold text-primary">#{row.proposalId}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">{row.researcher}</td>
                      <td className="px-6 py-4 text-center text-xs font-label">
                        {row.gate === "Conditional" ? "Missing" : "Complete"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">{row.score}</td>
                      <td className="px-6 py-4 text-right text-xs font-label text-primary">View Full Proposal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
              <span>Showing 3 of 182 flagged entries</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 rounded border border-outline-variant/25">1</button>
                <button className="px-2 py-1 rounded border border-outline-variant/25">2</button>
                <button className="px-2 py-1 rounded border border-outline-variant/25">3</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                <div>
                  <h4 className="font-headline text-lg font-bold text-primary">Automated Logic Updated</h4>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    Screening engine now uses V2.4 rules and reduced false flags by 14%.
                  </p>
                  <button className="text-xs text-primary font-label font-semibold mt-2 hover:underline">
                    View version history
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error">priority_high</span>
                <div>
                  <h4 className="font-headline text-lg font-bold text-primary">Critical Review Required</h4>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    48 proposals have conflicting metadata and require manual verification before disbursement.
                  </p>
                  <button className="text-xs text-primary font-label font-semibold mt-2 hover:underline">
                    Review Priority List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
