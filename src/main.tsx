import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import App from './App';
import Home from './pages/Home';
import Panic from './pages/Panic';
import Checkin from './pages/Checkin';
import Reflection from './pages/Reflection';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Game from './pages/Game';
import './index.css';
import { Toaster } from '@/components/ui/sonner';

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
