import React from 'react';
import { GoogleLoginCard } from '../components/auth/GoogleLoginCard';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top minimal header with brand mark */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-slate-950 transition cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <span className="text-white font-bold text-xs">RL</span>
          </div>
          <span>RetailLens AI</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Secure Authentication
        </span>
      </div>

      {/* Main Centered Login Card */}
      <main className="my-auto py-8">
        <GoogleLoginCard
          onSuccess={onLoginSuccess}
          onBackToLanding={onBackToLanding}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        RetailLens AI &bull; Enterprise-grade Ecommerce Intelligence &bull; Google Login Only
      </footer>
    </div>
  );
};
