import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  LayoutDashboard, 
  MessageCircle, 
  Utensils, 
  Calendar, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const DashboardNav = () => {
  const location = useLocation();

  const links = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "AI Chat",
      to: "/chatbot",
      icon: MessageCircle,
    },
    {
      label: "Diet Plan", // 🔥 MEAL GENERATOR
      to: "/diet-plan",
      icon: Utensils,
    },
    {
      label: "Period",
      to: "/period-tracker",
      icon: Calendar,
    },
    {
      label: "Profile",
      to: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-4">

      {/* LOGO */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
          ♥
        </div>
        <span className="text-lg font-bold">Her Wellness</span>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col gap-2">
        {links.map((l) => {
          const Icon = l.icon;

          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === l.to
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-600 hover:bg-pink-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
};

export default DashboardNav;