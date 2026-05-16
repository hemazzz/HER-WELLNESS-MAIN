import { ReactNode } from "react";
import DashboardNav from "./DashboardNav";

const DashboardLayout = ({
  children,
}: {
  children: ReactNode;
}) => (

  <div className="min-h-screen bg-background flex">

    {/* 🔥 SIDEBAR */}
    <DashboardNav />

    {/* 🔥 MAIN CONTENT */}
    <main className="flex-1 md:ml-64 p-6 overflow-y-auto">

      {children}

    </main>

  </div>

);

export default DashboardLayout;