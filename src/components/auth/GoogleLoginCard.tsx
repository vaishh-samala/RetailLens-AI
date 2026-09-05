import React, { useState } from 'react';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '../../services/auth/AuthContext';
import { Eye, ShieldCheck, Loader2 } from 'lucide-react';

interface GoogleLoginCardProps {
  onSuccess?: () => void;
  onBackToLanding?: () => void;
}

export const GoogleLoginCard: React.FC<GoogleLoginCardProps> = ({
  onSuccess,
  onBackToLanding,
}) => {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const msg = err?.message || 'Unable to complete Google sign-in. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 relative">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-sm mb-4">
          <Eye className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          RetailLens AI
        </h1>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mt-1">
          "See your business. Make smarter decisions."
        </p>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-medium text-slate-800">
            Welcome to RetailLens AI
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Turn your ecommerce data into clear, actionable business insights.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Exactly ONE primary authentication action: Continue with Google */}
      <div className="space-y-4">
        <button
          id="google-continue-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full h-12 flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-medium text-sm transition shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5" />
              <span className="text-slate-900 font-semibold">Continue with Google</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Single sign-on protected by Google OAuth standard</span>
        </div>
      </div>

      {/* Terms & Privacy */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-700 underline underline-offset-2 hover:text-slate-900">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-700 underline underline-offset-2 hover:text-slate-900">
            Privacy Policy
          </a>.
        </p>
      </div>

      {/* Back Link */}
      {onBackToLanding && (
        <div className="mt-6 text-center">
          <button
            id="back-to-landing-btn"
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <span>← Back to RetailLens AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
