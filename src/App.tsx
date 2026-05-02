import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Home as HomeIcon, Heart, Calendar, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitialised } = useStore();

  useEffect(() => {
    if (!isInitialised && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [isInitialised, navigate, location.pathname]);

  const navItems = [
    { icon: HomeIcon, path: '/', label: 'Today' },
    { icon: Heart, path: '/checkin', label: 'Check-in' },
    { icon: AlertCircle, path: '/panic', label: 'Breathe' },
    { icon: Calendar, path: '/reflect', label: 'History' },
    { icon: SettingsIcon, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <main className="relative max-w-lg mx-auto px-6 pt-12 pb-32 min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 group cursor-default">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-xl font-medium tracking-tight text-primary">Rewire</h1>
          </div>
          <button 
            id="nav-emergency"
            onClick={() => navigate('/panic')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium text-xs transition-all hover:bg-opacity-90 active:scale-95"
          >
            I need a minute
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-card/40 backdrop-blur-2xl border border-border/40 rounded-full h-16 flex items-center justify-around px-2 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            if (item.path === '/panic') return null; // Already in header
            return (
              <button
                key={item.path}
                id={`nav-${item.label.toLowerCase()}`}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-500",
                  isActive ? "text-primary bg-secondary/50 rounded-full" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
