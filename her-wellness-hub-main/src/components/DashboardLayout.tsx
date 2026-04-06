import { ReactNode } from 'react';
import DashboardNav from './DashboardNav';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <DashboardNav />
    <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 p-4 md:p-8">
      {children}
    </main>
  </div>
);

export default DashboardLayout;
