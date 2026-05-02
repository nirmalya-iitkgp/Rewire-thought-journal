import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const questions = [
  {
    id: 'energy',
    text: "How's your energy right now?",
    options: [
      { label: 'Low', emoji: '😴', value: 0 },
      { label: 'Neutral', emoji: '😐', value: 1 },
      { label: 'High', emoji: '⚡', value: 2 },
    ]
  },
  {
    id: 'mood',
    text: "How are you feeling?",
    options: [
      { label: 'Struggling', emoji: '🌧️', value: 0 },
      { label: 'Okay', emoji: '⛅', value: 1 },
      { label: 'Great', emoji: '☀️', value: 2 },
    ]
  },
  {
    id: 'connection',
    text: "How connected do you feel to others?",
    options: [
      { label: 'Isolated', emoji: '🏝️', value: 0 },
      { label: 'A bit', emoji: '😶', value: 1 },
      { label: 'Connected', emoji: '🤝', value: 2 },
    ]
  }
];

export default function Checkin() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleSelect = (value: number) => {
    const newResponses = { ...responses, [questions[step].id]: value };
    setResponses(newResponses);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      finish(newResponses);
    }
  };

  const finish = async (finalResponses: Record<string, number>) => {
    await db.checkins.add({
      timestamp: Date.now(),
      energy: finalResponses.energy,
      mood: finalResponses.mood,
      connection: finalResponses.connection
    });
    toast.success("Thank you for sharing.");
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-16 py-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-semibold">Daily Check-in</p>
        <h2 className="text-4xl font-serif italic text-primary leading-tight">A brief moment to pause.</h2>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <p className="text-2xl text-center font-medium px-4 text-muted-foreground">
            {questions[step].text}
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {questions[step].options.map((opt) => (
              <button
                key={opt.value}
                id={`checkin-opt-${opt.label.toLowerCase()}`}
                onClick={() => handleSelect(opt.value)}
                className="group flex flex-col items-center gap-4 p-8 bg-card border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[2.5rem] hover:bg-primary transition-all duration-500 transform active:scale-95"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{opt.emoji}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover:text-primary-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2">
        {questions.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-primary' : 'w-2 bg-primary/10'}`} 
          />
        ))}
      </div>
    </div>
  );
}
