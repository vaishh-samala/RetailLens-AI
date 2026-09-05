import React from 'react';
import {
  X,
  Sparkles,
  Users,
  Package,
  TrendingUp,
  MessageSquareText,
  ScanEye,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface FutureRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureRoadmapModal: React.FC<FutureRoadmapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentFeatures = [
    { title: 'Sales & Revenue Analytics', status: 'Live in MVP', desc: 'Deterministic sales ledger calculation, AOV, daily revenue trends' },
    { title: 'Product Performance', status: 'Live in MVP', desc: 'Catalog-wide SKU tracking, revenue share, performance badges' },
    { title: 'AI Business Insights Assistant', status: 'Live in MVP', desc: 'Executive summary, key observations, tactical actions, risk alerts' },
  ];

  const comingNextFeatures = [
    {
      title: 'Customer Segmentation & Insights',
      icon: Users,
      desc: 'RFM customer clustering, cohort retention curves, lifetime value (LTV) benchmarks.',
    },
    {
      title: 'Product & Inventory Intelligence',
      icon: Package,
      desc: 'Stockout warning thresholds, reorder quantity recommendations, sell-through velocity.',
    },
    {
      title: 'Sales Forecasting',
      icon: TrendingUp,
      desc: 'Predictive revenue modeling with seasonal decomposition and confidence intervals.',
    },
    {
      title: 'Review & NLP Intelligence',
      icon: MessageSquareText,
      desc: 'Sentiment extraction across product reviews, recurring quality defects detection.',
    },
    {
      title: 'Computer Vision',
      icon: ScanEye,
      desc: 'Visual shelf-space analysis, product hero imagery quality scoring, packaging audit.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">RetailLens AI Roadmap</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                Product Vision
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current MVP focus and upcoming capabilities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Active MVP Scope */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Current MVP Capabilities (Active)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentFeatures.map((f) => (
                <div key={f.title} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs">
                  <div className="font-semibold text-slate-900">{f.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-normal">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Next Future Roadmap */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Coming Next (Future Roadmap)</span>
            </h4>
            <div className="space-y-2.5">
              {comingNextFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3.5 text-xs"
                  >
                    <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                          Planned
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Future features are scheduled for post-MVP releases.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
