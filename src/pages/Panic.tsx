import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Wind, Eye, Target } from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateUrgeIntensity, getCrisisSupportLine } from '@/engine/logic';

export default function Panic() {
  const [step, setStep] = useState(0);
  const { lastLambda } = useStore();
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    if (step === 1) {
      const start = Date.now();
      const interval = setInterval(() => {
        const currentIntensity = calculateUrgeIntensity(1, lastLambda, Date.now() - start);
        setIntensity(currentIntensity);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, lastLambda]);

  const steps = [
    {
      title: "Take a deep breath",
      description: "You're safe. This feeling is just a wave, and it will pass.",
      action: "Start breathing",
      icon: Wind
    },
    {
      title: "Ride the wave",
      description: "Follow the circle. Your mind is already starting to quiet down.",
      action: "Next",
      icon: Wind
    },
    {
      title: "Look around you",
      description: "Quietly name 3 things you can see right now. Take your time.",
      action: "I've named them",
      icon: Eye
    },
    {
      title: "One small step",
      description: "You just proved you can handle this. How about drinking a glass of water?",
      action: "I'm okay now",
      icon: Target
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-16 py-12 animate-in fade-in duration-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12 max-w-sm"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-serif italic text-primary leading-tight">{currentStep.title}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {step === 1 && (
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 6 * intensity,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary/10 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 6 * intensity,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 border-2 border-primary/20 rounded-full"
              />
              <div className="absolute text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">
                Breathe
              </div>
            </div>
          )}

          {step === 3 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-xs text-muted-foreground max-w-xs mx-auto mt-8 border-t border-border pt-4"
            >
              {getCrisisSupportLine()}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-xs pt-12">
        <button 
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : setStep(0)}
          className="w-full h-16 rounded-full border border-border bg-card text-primary font-medium tracking-tight text-lg hover:bg-secondary transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
        >
          {currentStep.action}
        </button>
      </div>
    </div>
  );
}
