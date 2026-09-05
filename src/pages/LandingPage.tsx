import React from 'react';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import {
  Eye,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Package,
  BrainCircuit,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToContact: () => void;
  onOpenRoadmap: () => void;
  onGoToOverview?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToContact,
  onOpenRoadmap,
}) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToAbout = () => {
    const el = document.getElementById('about-us-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Navigation Header: RetailLens AI                    About Us   Contact    Sign In */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            id="landing-brand-btn"
            onClick={handleScrollToTop}
            className="flex items-center gap-2.5 text-left group transition cursor-pointer"
            title="RetailLens AI - Top of page"
          >
            <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-slate-900 text-lg group-hover:text-indigo-600 transition">
              RetailLens AI
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              id="landing-header-about-btn"
              onClick={handleScrollToAbout}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              About Us
            </button>

            <button
              id="landing-header-contact-btn"
              onClick={onGoToContact}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Contact
            </button>

            <button
              id="landing-header-login-btn"
              onClick={onGoToLogin}
              className="inline-flex items-center justify-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-semibold tracking-wider text-slate-600 uppercase shadow-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            AI-POWERED ECOMMERCE ANALYTICS
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            See your business.
            <br />
            <span className="text-slate-500">Make smarter decisions.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            RetailLens AI helps ecommerce businesses understand sales, product performance, and
            business trends through analytics and AI-powered insights.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-primary-cta"
              onClick={onGoToLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-md bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition shadow-sm cursor-pointer"
            >
              <span>Analyze Your Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-signin-cta"
              onClick={onGoToLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Single Sign-On • No credit card required</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-14 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-xl">
            {/* Mock Dashboard Window Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  retaillens.app/store/overview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded text-[10px]">
                  Live Store Sync
                </span>
              </div>
            </div>

            {/* Preview KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Total Revenue
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">$14,892.40</div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Total Orders
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">118 Orders</div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +12.1%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Units Sold
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">264 Units</div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +15.7%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Average Order Value
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">$126.20</div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +5.6%
                </span>
              </div>
            </div>

            {/* Preview Chart & Insights row */}
            <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Mini Trend */}
              <div className="md:col-span-2 p-4 bg-white rounded-xl border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-2">
                  <span>Revenue Trend</span>
                  <span className="text-[11px] text-slate-400 font-normal">Last 30 Days</span>
                </div>
                {/* SVG mock trend line */}
                <div className="h-32 w-full flex items-end pt-4 pb-1">
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q50,65 100,50 T200,45 T300,20 T400,10 L400,100 L0,100 Z"
                      fill="url(#landingGrad)"
                    />
                    <path
                      d="M0,80 Q50,65 100,50 T200,45 T300,20 T400,10"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Aug 01</span>
                  <span>Aug 15</span>
                  <span>Sep 04 (Current)</span>
                </div>
              </div>

              {/* Mini AI Insights card matching Clean Utility dark card */}
              <div className="p-5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-white">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span>AI Business Insights</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/90 rounded border-l-2 border-indigo-500 mb-2.5">
                    <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                      "Revenue is growing, driven primarily by your strongest-performing products."
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                      <span>Electronics accounts for 58% of store revenue.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                      <span>Top SKU concentration creates single-item dependency.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 mt-3">
                  <span>Deterministic Analysis</span>
                  <span className="text-indigo-400 font-medium">AI Interpreted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core MVP Capabilities Focus */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core MVP Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Purpose-built for ecommerce decision makers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-xs">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. Sales & Revenue Analytics
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Deterministic calculation of store gross revenue, transaction orders, units sold,
                and average order value with historical period benchmarking.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-xs">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. Product Performance
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                In-depth catalog diagnostics tracking top revenue drivers, unit velocity, category
                concentration, and automated performance indicator badges.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-xs">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                3. AI Business Insights Assistant
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Structured business interpretation producing an Executive Summary, Key Observations,
                Recommended Actions, and Potential Risk analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us-section" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-semibold tracking-wider text-indigo-700 uppercase shadow-xs mb-3">
              About RetailLens AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Transforming raw transaction logs into commercial clarity
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              RetailLens AI was engineered to bridge the gap between complex retail data architectures and day-to-day merchandising decisions. We believe store owners deserve transparent metrics without bloated enterprise software or opaque black-box estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center mb-4 border border-indigo-100">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Empower digital merchants with fast, deterministic analytics and intelligent business commentary that demystifies revenue trends, customer purchasing frequency, and SKU margin profiles.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center mb-4 border border-indigo-100">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Deterministic Integrity</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Every calculation in RetailLens AI is anchored strictly in validated store ledger mathematics. We never extrapolate fake transactions or substitute missing figures with artificial placeholders.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center mb-4 border border-indigo-100">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Actionable Output</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Rather than drowning teams in complex multi-dimensional cubes, RetailLens AI delivers concise executive summaries, inventory reorder alerts, and prioritized commercial actions that drive real bottom-line growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Roadmap Teaser */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-xl bg-slate-100/80 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Coming Next • Future Roadmap</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Advanced retail intelligence on the horizon
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Customer Segmentation, Product & Inventory Intelligence, Sales Forecasting, Review NLP,
              and Computer Vision are planned for future releases.
            </p>
          </div>

          <button
            onClick={onOpenRoadmap}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-900 shadow-xs transition cursor-pointer self-start md:self-auto"
          >
            <span>Explore Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <button
            type="button"
            onClick={handleScrollToTop}
            className="flex items-center gap-2 group transition cursor-pointer text-left"
            title="RetailLens AI - Top of page"
          >
            <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition">
              <Eye className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
              RetailLens AI
            </span>
            <span className="text-slate-500 font-normal">
              &copy; {new Date().getFullYear()} RetailLens Inc. All rights reserved.
            </span>
          </button>

          <div className="flex items-center gap-6">
            <button onClick={handleScrollToAbout} className="hover:text-slate-900 cursor-pointer">
              About Us
            </button>
            <button onClick={onGoToContact} className="hover:text-slate-900 cursor-pointer">
              Contact
            </button>
            <button onClick={onOpenRoadmap} className="hover:text-slate-900 cursor-pointer">
              Roadmap
            </button>
            <button onClick={onGoToLogin} className="hover:text-slate-900 cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
