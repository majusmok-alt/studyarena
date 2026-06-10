import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/AppLayout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Study } from './pages/Study';
import { Battles } from './pages/Battles';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { Social } from './pages/Social';

function Gate() {
  const { auth, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-full grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-brand-400 animate-spin" />
      </div>
    );
  }

  if (!auth) return <Auth />;

  return (
    <DataProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study" element={<Study />} />
            <Route path="/battles" element={<Battles />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/social" element={<Social />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </DataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
