import React, { useState } from 'react';
import { Eye, Mail, User, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../services/auth/AuthContext';

interface ContactPageProps {
  onBackToHome: () => void;
  onGoToLogin?: () => void;
  isEmbedded?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onGoToLogin,
  isEmbedded = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message with brief responsive feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const formCard = (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 relative">
      {isSubmitted ? (
        /* Success State */
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Message Sent Successfully
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-800">{formData.name}</span>. We have received your inquiry and our team will get in touch with you at <span className="font-semibold text-slate-800">{formData.email}</span> shortly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              id="contact-return-home-btn"
              onClick={onBackToHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition shadow-xs cursor-pointer"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="contact-send-another-btn"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        /* Contact Form */
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Contact Us
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Have a question, need help, or want to learn more about RetailLens AI? Send us a message and our team will get back to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="Alex Mercer"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${
                    errors.name ? 'border-red-400 bg-red-50/40 text-red-900' : 'border-slate-300 bg-white text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="alex@retailstore.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${
                    errors.email ? 'border-red-400 bg-red-50/40 text-red-900' : 'border-slate-300 bg-white text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Message
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Tell us about your ecommerce platform or questions regarding RetailLens AI analytics..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${
                    errors.message ? 'border-red-400 bg-red-50/40 text-red-900' : 'border-slate-300 bg-white text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400`}
                />
              </div>
              {errors.message && (
                <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending message...</span>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="w-full max-w-xl mx-auto py-4">
        {formCard}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-900">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 hover:text-slate-950 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-base">RetailLens AI</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Home
          </button>
          {onGoToLogin && (
            <button
              onClick={onGoToLogin}
              className="inline-flex items-center justify-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-md transition shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Card */}
      <main className="my-auto py-8 w-full max-w-xl mx-auto">
        {formCard}
      </main>

      {/* Minimal Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        RetailLens AI &bull; Enterprise-grade Ecommerce Intelligence
      </footer>
    </div>
  );
};
