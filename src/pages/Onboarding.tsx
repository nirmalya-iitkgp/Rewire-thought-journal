import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Shield, Sparkles, Heart, ArrowRight } from 'lucide-react';

const onboardingSteps = [
  {
    title: "Welcome to a quieter space.",
    description: "Rewire is designed to help you find balance and connection, at your own pace. No labels, just simple steps.",
    icon: Sparkles,
  },
  {
    title: "Philosophy of Peace.",
    description: "We don't believe in streaks or guilt. Every day is a fresh start. We focus on how you feel, not just what you do.",
    icon: Heart,
  },
  {
    title: "Privacy is our Foundation.",
    description: "Everything you do here stays on this device. We don't track you. No one else sees your growth but you.",
    icon: Shield,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [baseline, setBaseline] = useState({ mood: 1, energy: 1, connection: 1 });
  const [isFinishing, setIsFinishing] = useState(false);
  const { setInitialised } = useStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < onboardingSteps.length) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    setInitialised(true);
    await db.checkins.add({
      timestamp: Date.now(),
      ...baseline
    });
    navigate('/');
  };

  const StepIcon = onboardingSteps[step]?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        {step < onboardingSteps.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 text-center"
          >
            <div className="w-20 h-20 rounded-full border-2 border-primary/10 flex items-center justify-center mx-auto">
              <StepIcon className="w-10 h-10 text-primary/40" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl font-serif italic text-primary leading-tight">
                {onboardingSteps[step].title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {onboardingSteps[step].description}
              </p>
            </div>

            <button
               onClick={handleNext}
               className="w-full h-16 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all active:scale-95 shadow-xl shadow-primary/5"
            >
              Continue
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="baseline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 text-center w-full"
          >
            <div className="space-y-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">Starting point</p>
              <h2 className="text-4xl font-serif italic text-primary leading-tight">How have you been feeling lately?</h2>
              <p className="text-muted-foreground">This helps us tailor the experience to your needs.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium">General Mood</p>
                <div className="flex justify-center gap-4">
                  {[0, 1, 2].map(v => (
                    <button
                      key={v}
                      onClick={() => setBaseline(prev => ({ ...prev, mood: v }))}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${baseline.mood === v ? 'bg-primary text-white scale-110' : 'bg-secondary/50 text-muted-foreground bg-card shadow-sm border border-border/50'}`}
                    >
                      {v === 0 ? '🌧️' : v === 1 ? '⛅' : '☀️'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium">Social Connection</p>
                <div className="flex justify-center gap-4">
                  {[0, 1, 2].map(v => (
                    <button
                      key={v}
                      onClick={() => setBaseline(prev => ({ ...prev, connection: v }))}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${baseline.connection === v ? 'bg-primary text-white scale-110' : 'bg-secondary/50 text-muted-foreground bg-card shadow-sm border border-border/50'}`}
                    >
                      {v === 0 ? '🏝️' : v === 1 ? '😶' : '🤝'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
               onClick={handleFinish}
               className="w-full h-16 rounded-full bg-primary text-primary-foreground font-medium text-lg transition-all active:scale-95 shadow-xl shadow-primary/5"
            >
              Begin Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step < onboardingSteps.length && (
        <div className="fixed bottom-12 flex gap-2">
          {onboardingSteps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-primary' : 'w-2 bg-primary/10'}`} 
            />
          ))}
          <div className={`h-1 rounded-full transition-all duration-700 ${step === onboardingSteps.length ? 'w-10 bg-primary' : 'w-2 bg-primary/10'}`} />
        </div>
      )}
    </div>
  );
}
