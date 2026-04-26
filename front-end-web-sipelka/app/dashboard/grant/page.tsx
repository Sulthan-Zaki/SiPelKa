import Link from "next/link";

type SubmissionStatus = "Review" | "Pending" | "Approved";

type Submission = {
  id: string;
  initials: string;
  investigator: string;
  department: string;
  title: string;
  program: string;
  submittedAt: string;
  requestedBudget: string;
  status: SubmissionStatus;
};

const submissions: Submission[] = [
  {
    id: "GRT-2024-091",
    initials: "AP",
    investigator: "Dr. Agus Pratama",
    department: "Bio-Molecular Lab",
    title: "AI-Driven Genomics for Tropical Disease Resistance",
    program: "International Research Grant 2024",
    submittedAt: "Oct 24, 2023",
    requestedBudget: "Rp 680M",
    status: "Review",
  },
  {
    id: "GRT-2024-087",
    initials: "LS",
    investigator: "Linda Setiawan, Ph.D.",
    department: "Civil Engineering Dept.",
    title: "Sustainable Concrete from Agricultural Waste",
    program: "Infrastructure Innovation Fund",
    submittedAt: "Oct 22, 2023",
    requestedBudget: "Rp 520M",
    status: "Pending",
  },
  {
    id: "GRT-2024-084",
    initials: "BK",
    investigator: "Budi Kusuma",
    department: "Social Sciences",
    title: "Urban Migration Dynamics in Southeast Asia",
    program: "Strategic Humanities Fund",
    submittedAt: "Oct 21, 2023",
    requestedBudget: "Rp 430M",
    status: "Review",
  },
  {
    id: "GRT-2024-080",
    initials: "RN",
    investigator: "Rina Novitasari",
    department: "Marine Biotechnology",
    title: "Mangrove Bioactive Compounds for Antimicrobial Application",
    program: "Blue Economy Research Scheme",
    submittedAt: "Oct 19, 2023",
    requestedBudget: "Rp 740M",
    status: "Approved",
  },
  {
    id: "GRT-2024-076",
    initials: "FA",
    investigator: "Farhan Akbar",
    department: "Computer Engineering",
    title: "Federated Learning for Multi-Campus Medical Imaging",
    program: "Digital Health Accelerator",
    submittedAt: "Oct 18, 2023",
    requestedBudget: "Rp 890M",
    status: "Pending",
  },
  {
    id: "GRT-2024-072",
    initials: "DN",
    investigator: "Dewi Nirmala",
    department: "Education Policy Unit",
    title: "Adaptive Learning Equity in Semi-Urban High Schools",
    program: "Education Transformation Program",
    submittedAt: "Oct 17, 2023",
    requestedBudget: "Rp 310M",
    status: "Review",
  },
  {
    id: "GRT-2024-069",
    initials: "HS",
    investigator: "Hendra Saputra",
    department: "Mechanical Design Lab",
    title: "Lightweight Composite for Electric Mobility Components",
    program: "Green Transport Innovation",
    submittedAt: "Oct 16, 2023",
    requestedBudget: "Rp 960M",
    status: "Approved",
  },
];

const statusStyles: Record<SubmissionStatus, string> = {
  Review: "bg-secondary-container text-on-secondary-container",
  Pending: "bg-surface-container text-on-surface-variant",
  Approved: "bg-emerald-50 text-emerald-700",
};

export default function GrantDashboardPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-6 px-4">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-on-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
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
            {
              icon: "dashboard",
              label: "Dashboard",
              href: "/dashboard",
            },
            {
              icon: "account_balance_wallet",
              label: "Grant Programs",
              href: "/dashboard/grant",
              active: true,
            },
            {
              icon: "database",
              label: "Researcher Data",
              href: "/dashboard/researcher-data",
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
          <button className="w-full mb-4 gradient-primary text-on-primary py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-label text-sm font-semibold cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Grant Program</span>
          </button>
          {[
            { icon: "settings", label: "Settings", href: "#" },
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

      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="w-full h-16 sticky top-0 z-40 glass-effect border-b border-outline-variant/20 flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-on-surface-variant text-sm outline-none focus:ring-1 focus:ring-primary/20 font-body"
                placeholder="Search submissions, investigators, or grant IDs..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-8">
            <button className="relative hover:text-primary text-on-surface-variant transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[22px]">
                notifications
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 border-l pl-5 border-outline-variant/30">
              <div className="text-right">
                <p className="font-semibold text-primary text-sm font-label">
                  Dr. Sarah Wijaya
                </p>
                <p className="text-[10px] text-on-surface-variant font-label">
                  Head Administrator
                </p>
              </div>
              <img
                alt="User profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5jmEX6YDyEn5PLA8VWPK6sjdL0u0oDRiAPBw52Tg82oji3_6_8SWpH8A5g50bgK04nFmaVaU99dHgz1JEll4n-D-Ax58Rp3cUQNM3eiJDz3Xm3q2dKx-zRnZV1MzuuAPGjCKwfQOvsNx95UQfeABx9XBWZa6jXQ9XbeZYNShfjRs_RF7fs-rL5aIApHx7n_NcwKGI6pvtKQx9__XVa1SrtDgi7swFjKzTt6arTG85J4vQT42KCXLuOX217fynr6PMtEVStmiFQ44"
              />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary">
                Grant Programs
              </h2>
              <p className="text-on-surface-variant font-body text-sm mt-1">
                SIPELKA Dashboard - Scrolled to Recent Submissions
              </p>
            </div>
            <button className="gradient-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold font-label hover:opacity-90 transition-opacity cursor-pointer">
              Export Submissions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
                Total Active Proposals
              </p>
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                142
              </h3>
              <p className="text-xs mt-2 text-emerald-700 font-label">
                +12% vs last month
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
                Under Review
              </p>
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                38
              </h3>
              <p className="text-xs mt-2 text-on-surface-variant font-label">
                21 submissions this week
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-label font-bold mb-2">
                Budget Requested
              </p>
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                Rp 4.53B
              </h3>
              <p className="text-xs mt-2 text-on-surface-variant font-label">
                Across 7 latest submissions
              </p>
            </div>
          </div>

          <section className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
            <div className="p-8 border-b border-surface-container-low flex items-center justify-between">
              <div>
                <h4 className="font-headline text-xl font-bold text-primary">
                  Recent Submissions
                </h4>
                <p className="text-xs text-on-surface-variant font-body">
                  Detailed view of latest research grant applications
                </p>
              </div>
              <button className="text-primary font-semibold text-sm hover:underline font-label cursor-pointer">
                View All Submissions
              </button>
            </div>

            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label">
                    <th className="px-8 py-4">Investigator</th>
                    <th className="px-8 py-4">Research Title</th>
                    <th className="px-8 py-4">Program</th>
                    <th className="px-8 py-4 text-center">Submission Date</th>
                    <th className="px-8 py-4 text-right">Budget</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {submissions.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold font-label shrink-0">
                            {row.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-primary font-headline">
                              {row.investigator}
                            </p>
                            <p className="text-[10px] text-on-surface-variant font-body">
                              {row.department} • {row.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-on-surface line-clamp-1 font-body">
                          {row.title}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-xs text-on-surface-variant font-body">
                        {row.program}
                      </td>
                      <td className="px-8 py-5 text-center text-xs text-on-surface-variant font-label">
                        {row.submittedAt}
                      </td>
                      <td className="px-8 py-5 text-right text-xs font-semibold text-on-surface font-label">
                        {row.requestedBudget}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-label ${statusStyles[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
