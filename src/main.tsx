import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import Panic from './pages/Panic.tsx';
import Checkin from './pages/Checkin.tsx';
import Reflection from './pages/Reflection.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Settings from './pages/Settings.tsx';
import Game from './pages/Game.tsx';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="panic" element={<Panic />} />
            <Route path="checkin" element={<Checkin />} />
            <Route path="reflect" element={<Reflection />} />
            <Route path="game" element={<Game />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
