import { Link, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, MessageCircle, Utensils, CalendarHeart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chatbot', icon: MessageCircle, label: 'AI Chat' },
  { to: '/diet-plan', icon: Utensils, label: 'Diet Plan' },
  { to: '/period-tracker', icon: CalendarHeart, label: 'Period' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const DashboardNav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col z-50">
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <div className="w-9 h-9 rounded-full gradient-pink flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="white" />
          </div>
          <span className="text-lg font-bold text-foreground">Her Wellness</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                pathname === l.to ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <l.icon className="w-5 h-5" />
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header + bottom nav */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur border-b border-border z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="white" />
          </div>
          <span className="font-bold text-foreground">Her Wellness</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 top-14 bg-card z-40 p-4">
          <nav className="space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === l.to ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <l.icon className="w-5 h-5" />
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50 flex justify-around py-2">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-xs",
              pathname === l.to ? "text-primary" : "text-muted-foreground"
            )}
          >
            <l.icon className="w-5 h-5" />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default DashboardNav;
