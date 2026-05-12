import Sidebar from "@/components/layout/Sidebar";
import ChatBot from "@/components/ui/ChatBot";
import { DataProvider } from "@/context/DataContext";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DataProvider>
        <Sidebar />
        <main className="lg:ml-64 min-h-screen flex flex-col">{children}</main>
        <ChatBot />
      </DataProvider>
    </SidebarProvider>
  );
}
