import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="ml-64 flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
