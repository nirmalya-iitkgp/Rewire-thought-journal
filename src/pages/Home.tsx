import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useStore } from '@/lib/store';
import { detectTriggerRisk, getWellbeingState, getRandomMission } from '@/engine/logic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Sun, Moon, Coffee, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { habitMomentum, userK } = useStore();
  const [currentAction, setCurrentAction] = useState<{
    title: string;
    description: string;
    icon: any;
    type: 'physical' | 'social' | 'mental';
  } | null>(null);
  
  const lastCheckin = useLiveQuery(() => db.checkins.orderBy('timestamp').last());
  
  useEffect(() => {
    // Decision Engine: Picks the ONE action
    const risk = detectTriggerRisk(Date.now(), lastCheckin?.mood || 1, lastCheckin?.energy || 1);
    
    if (risk > 0.8) {
      setCurrentAction({
        title: "I'm detecting some heavy clouds.",
        description: "It looks like things are a bit tough right now. Would you like to reach out to someone, or just take a minute to breathe?",
        icon: Moon,
        type: 'mental'
      });
    } else if (risk > 0.5) {
      setCurrentAction({
        title: "Take a 5-minute walk outside",
        description: "The air and movement will help reset your focus right now.",
        icon: Coffee,
        type: 'physical'
      });
    } else if (lastCheckin && lastCheckin.connection < 1) {
      setCurrentAction({
        title: getRandomMission(),
        description: "A small connection goes a long way. No pressure, just a reach out.",
        icon: Heart,
        type: 'social'
      });
    } else {
      setCurrentAction({
        title: "You're doing well today",
        description: "Go live your life. Everything you've built is working.",
        icon: Sun,
        type: 'mental'
      });
    }
  }, [lastCheckin]);

  const wellbeing = getWellbeingState(habitMomentum, userK);

  const handleDone = async () => {
    await db.actions.add({
      timestamp: Date.now(),
      type: 'healthy',
      success: true,
      description: currentAction?.title
    });
    toast.success("Action logged. Well done.");
  };

  if (!currentAction) return null;

  return (
    <div className="space-y-16 py-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="space-y-6 text-center lg:text-left">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.2em]">Current Momentum</p>
        <h1 className="text-5xl lg:text-6xl font-serif font-light italic leading-tight text-primary">
          {new Date().getHours() > 17 ? "It's a quiet evening." : "A calm day ahead."}
        </h1>
        <p className="text-xl text-muted-foreground/80 max-w-sm mx-auto lg:mx-0">
          The quiet moments are where your progress lives. You're doing better than you think.
        </p>
      </header>

      <Card className="p-12 border border-border shadow-[0_4px_40px_rgba(0,0,0,0.02)] rounded-[3rem] bg-card hover:scale-[1.01] transition-transform duration-500 group cursor-default">
        <div className="space-y-8 flex flex-col items-center text-center">
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.25em]">Today's Mission</p>
            <h2 className="text-3xl font-medium tracking-tight text-primary leading-tight">
              {currentAction.title}
            </h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            {currentAction.description}
          </p>

          <button 
            onClick={handleDone}
            className="flex items-center justify-center gap-3 text-muted-foreground hover:text-primary font-medium transition-all group-hover:translate-y-[-2px]"
          >
            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
              <CheckCircle2 className="w-3 h-3 text-transparent group-hover:text-primary-foreground" />
            </div>
            <span>I did this</span>
          </button>
        </div>
      </Card>

      <footer className="w-full flex justify-between items-end border-t border-border pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#5B6D5B]">
            <span className="text-lg leading-none">🌿</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{wellbeing.split(' ')[1]}</span>
          </div>
          <p className="text-muted-foreground text-xs max-w-[180px] leading-relaxed">
            Your new routine is now stronger than the old one. Keep tending to it.
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-primary text-xs font-semibold">"Your toughest window was Tuesday."</p>
          <p className="text-muted-foreground text-[10px]">You've handled this behavioral shift well.</p>
        </div>
      </footer>
    </div>
  );
}
