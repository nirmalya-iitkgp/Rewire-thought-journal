import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RewireState {
  habitMomentum: number;
  newHabitMomentum: number;
  lastLambda: number;
  userK: number;
  isInitialised: boolean;
  onboardingStep: number;
  
  setMomentum: (oldH: number, newH: number) => void;
  setInitialised: (val: boolean) => void;
  setOnboardingStep: (step: number) => void;
}

export const useStore = create<RewireState>()(
  persist(
    (set) => ({
      habitMomentum: 0.5,
      newHabitMomentum: 0,
      lastLambda: 0.005,
      userK: 0.05,
      isInitialised: false,
      onboardingStep: 0,
      
      setMomentum: (oldH, newH) => set({ habitMomentum: oldH, newHabitMomentum: newH }),
      setInitialised: (val) => set({ isInitialised: val }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
    }),
    {
      name: 'rewire-storage',
    }
  )
);
