import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/auth/AuthContext';
import { ActivePage, DatasetMeta, RawSaleRecord } from './types';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactPage } from './pages/ContactPage';
import { FutureRoadmapModal } from './components/roadmap/FutureRoadmapModal';
import { Loader2, Eye } from 'lucide-react';

const INITIAL_EMPTY_META: DatasetMeta = {
  sourceName: '',
  isDemo: false,
  totalRecords: 0,
  detectedColumns: [],
  dateRange: {
    start: '',
    end: '',
  },
  validationStatus: 'none',
  validationMessage: 'No sales data uploaded yet. Connect your store data to get started.',
  missingRequiredCols: [],
};

function getPageFromLocation(isAuth: boolean): ActivePage {
  if (typeof window === 'undefined') return 'landing';

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path.includes('/dashboard') || hash.includes('#dashboard')) {
    return isAuth ? 'dashboard' : 'login';
  }

  if (path.includes('/login') || hash.includes('#login')) {
    return isAuth ? 'dashboard' : 'login';
  }

  if (path.includes('/contact') || hash.includes('#contact')) {
    return 'contact';
  }

  return 'landing';
}

const AppContent: React.FC = () => {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => getPageFromLocation(isAuthenticated));
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // Store data state (shared between Dashboard and Upload)
  const [rawRecords, setRawRecords] = useState<RawSaleRecord[]>([]);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta>(INITIAL_EMPTY_META);

  // Synchronize route once authentication status is resolved
  useEffect(() => {
    if (loading) return;

    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('/dashboard') || hash.includes('#dashboard')) {
      if (isAuthenticated) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
        window.history.replaceState({}, '', '/login');
      }
    } else if (path.includes('/login') || hash.includes('#login')) {
      if (isAuthenticated) {
        setCurrentPage('dashboard');
        window.history.replaceState({}, '', '/dashboard');
      } else {
        setCurrentPage('login');
      }
    } else if (path.includes('/contact') || hash.includes('#contact')) {
      setCurrentPage('contact');
    }
  }, [loading, isAuthenticated]);

  // Protected route guard: Ensure unauthenticated users cannot access dashboard
  useEffect(() => {
    if (loading) return;

    if (currentPage === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login');
      window.history.replaceState({}, '', '/login');
    }
  }, [currentPage, isAuthenticated, loading]);

  // Handle browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromLocation(isAuthenticated);
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const navigateTo = (page: ActivePage) => {
    if (page === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login');
      window.history.pushState({}, '', '/login');
      return;
    }

    setCurrentPage(page);
    const targetUrl = page === 'landing' ? '/' : `/${page}`;
    window.history.pushState({}, '', targetUrl);
  };

  const handleDatasetChange = (newRecords: RawSaleRecord[], newMeta: DatasetMeta) => {
    setRawRecords(newRecords);
    setDatasetMeta(newMeta);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentPage('landing');
    window.history.pushState({}, '', '/');
  };

  // While Firebase is verifying the persisted session on refresh, show a clean indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Eye className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Verifying RetailLens AI session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-indigo-600 selection:text-white">
      {currentPage === 'landing' && (
        <LandingPage
          onGoToLogin={() => navigateTo('login')}
          onGoToContact={() => navigateTo('contact')}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
          onGoToOverview={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'contact' && (
        <ContactPage
          onBackToHome={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
          onGoToLogin={() => navigateTo('login')}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={() => navigateTo('dashboard')}
          onBackToLanding={() => navigateTo('landing')}
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardPage
          rawRecords={rawRecords}
          datasetMeta={datasetMeta}
          onDatasetChange={handleDatasetChange}
          onSignOut={handleSignOut}
        />
      )}

      {/* Global Roadmap Modal */}
      <FutureRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
