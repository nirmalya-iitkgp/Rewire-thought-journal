import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

const rounds = [
  { immediate: 10, delayed: 20, delayDays: 7 },
  { immediate: 50, delayed: 100, delayDays: 30 },
  { immediate: 10, delayed: 50, delayDays: 14 },
  { immediate: 100, delayed: 150, delayDays: 30 },
  { immediate: 5, delayed: 25, delayDays: 7 }
];

export default function Game() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<('now' | 'later')[]>([]);
  const navigate = useNavigate();

  const handleSelect = async (choice: 'now' | 'later') => {
    const newSelections = [...selections, choice];
    setSelections(newSelections);

    if (step < rounds.length - 1) {
      setStep(step + 1);
    } else {
      const laterCount = newSelections.filter(s => s === 'later').length;
      const k = Math.max(0.001, 0.1 - (laterCount * 0.02));
      
      await db.impulsivityTests.add({
        timestamp: Date.now(),
        kValue: k
      });
      
      toast.success("Focus exercise complete.");
      navigate('/');
    }
  };

  const currentRound = rounds[step];

  return (
    <div className="flex-1 flex flex-col justify-center space-y-16 py-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">Focus Exercise</p>
        <h2 className="text-4xl italic text-primary leading-tight font-serif italic">A choice of perspective.</h2>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-12"
        >
          <p className="text-xl text-center text-muted-foreground px-8 font-light">
            If you could choose between these two options today, which would you pick?
          </p>

          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <Button
              variant="ghost"
              onClick={() => handleSelect('now')}
              className="group p-8 h-auto bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[2.5rem] hover:bg-primary transition-all duration-500 text-left justify-start"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary-foreground group-hover:text-primary transition-colors text-xs font-bold uppercase tracking-tighter">
                  Now
                </div>
                <div>
                  <p className="text-2xl font-serif group-hover:text-primary-foreground transition-colors">${currentRound.immediate}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover:text-primary-foreground/60 transition-colors">Immediate reward</p>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleSelect('later')}
              className="group p-8 h-auto bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[2.5rem] hover:bg-primary transition-all duration-500 text-left justify-start"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary-foreground group-hover:text-primary transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif group-hover:text-primary-foreground transition-colors">${currentRound.delayed}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover:text-primary-foreground/60 transition-colors">After {currentRound.delayDays} days</p>
                </div>
              </div>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2">
        {rounds.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-primary' : 'w-2 bg-primary/10'}`} 
          />
        ))}
      </div>
    </div>
  );
}
