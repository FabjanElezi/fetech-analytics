import Sidebar from "@/components/layout/Sidebar";
import ChatBot from "@/components/ui/ChatBot";
import CommandPalette from "@/components/ui/CommandPalette";
import DateRangeBar from "@/components/ui/DateRangeBar";
import { DataProvider } from "@/context/DataContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ToastProvider } from "@/context/ToastContext";
import { DateRangeProvider } from "@/context/DateRangeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DataProvider>
        <ToastProvider>
          <DateRangeProvider>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen flex flex-col">
              <DateRangeBar />
              {children}
            </main>
            <ChatBot />
            <CommandPalette />
          </DateRangeProvider>
        </ToastProvider>
      </DataProvider>
    </SidebarProvider>
  );
}
