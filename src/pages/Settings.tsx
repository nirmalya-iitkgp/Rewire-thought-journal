import { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '@/lib/db';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Shield, Download, Trash2, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { setInitialised } = useStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = {
        checkins: await db.checkins.toArray(),
        actions: await db.actions.toArray(),
        impulses: await db.impulses.toArray(),
        tests: await db.impulsivityTests.toArray(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rewire-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success("Data exported successfully. Keep it safe.");
    } catch (e) {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = async () => {
    if (confirm("This will permanently delete all your data on this device. This cannot be undone. Are you sure?")) {
      await db.delete();
      location.reload();
    }
  };

  const handleQuitOnboarding = () => {
    setInitialised(false);
    toast.info("Onboarding reset.");
  };

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-800">
      <header className="space-y-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">Controls</p>
        <h2 className="text-4xl font-serif italic text-primary">Your Space.</h2>
      </header>

      <section className="space-y-6">
        <h3 className="text-xl font-serif">Privacy & Data</h3>
        <Card className="p-8 border border-border bg-card rounded-[2.5rem] space-y-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-primary/5 rounded-2xl">
              <Shield className="w-6 h-6 text-primary/40" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Everything stays local</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is stored only on this device. We don't have accounts, 
                and we never see what you write or how you feel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full h-14 flex items-center justify-between px-6 bg-secondary/30 rounded-2xl hover:bg-secondary transition-all"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export Workspace</span>
              </div>
            </button>

            <button
              onClick={handleReset}
              className="w-full h-14 flex items-center justify-between px-6 text-destructive hover:bg-destructive/10 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete All Data</span>
              </div>
            </button>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-serif">Preferences</h3>
        <Card className="p-8 border border-border bg-card rounded-[2.5rem] space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reset Onboarding</span>
              <button 
                onClick={handleQuitOnboarding}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Start Over
              </button>
           </div>
        </Card>
      </section>

      <footer className="text-center pt-8 border-t border-border flex flex-col items-center gap-4">
        <p className="text-xs text-muted-foreground italic max-w-xs mx-auto">
          "The best tools are those you eventually put down because they worked."
        </p>
        <div className="w-1 h-1 rounded-full bg-primary/20" />
      </footer>
    </div>
  );
}
