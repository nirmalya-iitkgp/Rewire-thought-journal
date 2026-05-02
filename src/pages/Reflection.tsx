import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useStore } from '@/lib/store';
import { getWellbeingState } from '@/engine/logic';
import { Card } from '@/components/ui/Card';
import { motion } from 'motion/react';
import { Leaf, History, Sparkles } from 'lucide-react';

export default function Reflection() {
  const { habitMomentum, userK } = useStore();
  const actions = useLiveQuery(() => db.actions.orderBy('timestamp').reverse().limit(10).toArray());
  const checkins = useLiveQuery(() => db.checkins.orderBy('timestamp').reverse().limit(7).toArray());

  const wellbeing = getWellbeingState(habitMomentum, userK);

  // Simple narrative generator based on engine outputs
  const generateNarrative = () => {
    const recentHealthy = actions?.filter(a => a.type === 'healthy' && a.success).length || 0;
    const avgMood = checkins?.reduce((acc, c) => acc + c.mood, 0) || 0 / (checkins?.length || 1);

    let message = "You're finding your rhythm. ";
    if (recentHealthy > 5) message += "This week, you've consistently chosen healthy paths. ";
    if (avgMood > 1.2) message += "Your overall outlook is stabilizing. ";
    if (habitMomentum > 0.6) message += "The new ways of being are starting to feel natural now. ";
    
    return message || "Every small choice you make builds the foundation for tomorrow.";
  };

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">Growth Journey</p>
        <h2 className="text-4xl font-serif italic text-primary leading-tight">Your story, unfolding.</h2>
      </header>

      <section className="relative">
        <Card className="p-12 border border-border bg-card shadow-[0_4px_40px_rgba(0,0,0,0.02)] rounded-[3rem] space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary/40" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Self-Reflection</span>
          </div>
          <p className="text-2xl font-serif leading-relaxed italic text-primary">
            "{generateNarrative()}"
          </p>
        </Card>
      </section>

      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-xl font-serif">Recent Steps</h3>
          <History className="w-5 h-5 text-muted-foreground/40" />
        </div>
        
        <div className="space-y-4">
          {actions?.map((action, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={action.id}
              className="flex items-center justify-between p-6 bg-secondary/20 rounded-[2rem] border border-border/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                <span className="text-sm font-medium text-primary/80">{action.description || 'Action completed'}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {new Date(action.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </motion.div>
          ))}
          {actions?.length === 0 && (
            <p className="text-muted-foreground italic text-center py-12">
              No actions logged yet. Your journey begins with the next small choice.
            </p>
          )}
        </div>
      </section>

      <footer className="text-center pt-16 flex flex-col items-center gap-2">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Overall State</p>
        <p className="text-2xl font-serif italic text-primary">{wellbeing}</p>
      </footer>
    </div>
  );
}
