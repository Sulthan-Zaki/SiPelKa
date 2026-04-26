import Link from "next/link";

type Researcher = {
  name: string;
  faculty: string;
  institutionalId: string;
  hIndex: number;
  docs: number;
};

const researchers: Researcher[] = [
  {
    name: "Dr. Agus Pratama",
    faculty: "Life Sciences",
    institutionalId: "ID-9928341",
    hIndex: 24,
    docs: 412,
  },
  {
    name: "Linda Setiawan, Ph.D.",
    faculty: "Engineering",
    institutionalId: "ID-8812039",
    hIndex: 18,
    docs: 189,
  },
  {
    name: "Budi Kusuma",
    faculty: "Social Sciences",
    institutionalId: "ID-6632412",
    hIndex: 9,
    docs: 42,
  },
  {
    name: "Rina Novitasari",
    faculty: "Marine Biotechnology",
    institutionalId: "ID-1100223",
    hIndex: 41,
    docs: 912,
  },
];

export default function ResearcherDataPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-6 px-4">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[22px]">
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-primary font-headline">
              SIPELKA
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-label">
              Institutional Portal
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5">
          {[
            { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
            {
              icon: "account_balance_wallet",
              label: "Grant Programs",
              href: "/dashboard/grant",
            },
            {
              icon: "database",
              label: "Researcher Data",
              href: "/dashboard/researcher-data",
              active: true,
            },
            {
              icon: "payments",
              label: "Disbursement Status",
              href: "/dashboard/disbursement-status",
            },
            {
              icon: "fact_check",
              label: "Eligibility Evaluation",
              href: "/dashboard/eligibility-evaluation",
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
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8 space-y-8">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">
            Researcher Data Directory
          </h2>
          <p className="text-sm text-on-surface-variant font-body">
            Centralized directory of eligible academic personnel and research
            performance metrics.
          </p>
        </div>

        <section className="flex flex-wrap items-center gap-3">
          <button className="gradient-primary text-on-primary px-4 py-2 rounded-lg text-sm font-label font-semibold">
            Register New Researcher
          </button>
          <button className="bg-surface-container-low border border-outline-variant/25 px-4 py-2 rounded-lg text-sm font-label text-on-surface">
            All Faculties & Departments
          </button>
          <button className="bg-surface-container-low border border-outline-variant/25 px-4 py-2 rounded-lg text-sm font-label text-on-surface">
            Eligibility Status
          </button>
          <span className="ml-auto text-sm text-on-surface-variant font-label">
            Total: 1,248 Records
          </span>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Average H-Index", value: "14.2", hint: "+2.4 from last semester" },
            { label: "Total Citations", value: "42.8k", hint: "Institutional benchmark met" },
            { label: "Active Grants", value: "156", hint: "12 closing this month" },
            { label: "Verification Backlog", value: "04", hint: "Needs attention" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 p-6 ambient-shadow"
            >
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold">
                {card.label}
              </p>
              <p className="text-3xl font-headline font-extrabold text-primary mt-2">
                {card.value}
              </p>
              <p className="text-xs text-on-surface-variant mt-1 font-label">
                {card.hint}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden ambient-shadow">
          <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-primary">
              Researcher Directory
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-label border border-outline-variant/25">
                Export CSV
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-label border border-outline-variant/25">
                Print Report
              </button>
            </div>
          </div>
          <div className="px-6 py-3 flex flex-wrap gap-2">
            {[
              "Prof. Ahmad Dahlan",
              "Dr. Sri Sumarni",
              "Bambang Pamungkas, Ph.D.",
              "Maria Kartini, M.Sc.",
              "Yosef Widjaja, Ph.D.",
            ].map((person) => (
              <span
                key={person}
                className="px-3 py-1 rounded-full text-xs font-label bg-surface-container-low text-on-surface"
              >
                {person}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-label font-bold">
                  <th className="px-6 py-4 text-left">Researcher</th>
                  <th className="px-6 py-4 text-left">Faculty</th>
                  <th className="px-6 py-4 text-center">Institutional ID</th>
                  <th className="px-6 py-4 text-center">H-Index / Scopus</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {researchers.map((row) => (
                  <tr key={row.name} className="hover:bg-surface-container-low/60">
                    <td className="px-6 py-4 text-sm font-headline font-bold text-primary">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {row.faculty}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold">
                      {row.institutionalId}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold">
                      H-{row.hIndex} / {row.docs} docs
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label font-bold">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-primary font-label font-semibold">
                      Dossier
                      <span className="material-symbols-outlined text-[14px] align-middle ml-1">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-label">
            <span>Showing 1 - 5 of 1,248 Researchers</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded border border-outline-variant/25">
                1
              </button>
              <button className="px-2 py-1 rounded border border-outline-variant/25">
                2
              </button>
              <button className="px-2 py-1 rounded border border-outline-variant/25">
                3
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
