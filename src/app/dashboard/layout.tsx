import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
            <DashboardNav />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
