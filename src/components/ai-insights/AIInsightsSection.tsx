import React, { useState, useEffect } from 'react';
import {
  AnalyticsSummary,
  ProductPerformance,
  CategoryPerformance,
  AIInsightsReport,
} from '../../types';
import { aiInsightsService } from '../../services/ai/aiInsightsService';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  UploadCloud,
} from 'lucide-react';

interface AIInsightsSectionProps {
  summary: AnalyticsSummary;
  topProducts: ProductPerformance[];
  categories: CategoryPerformance[];
  onNavigateToUpload?: () => void;
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  summary,
  topProducts,
  categories,
  onNavigateToUpload,
}) => {
  const [report, setReport] = useState<AIInsightsReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasData = summary.totalOrders > 0 && topProducts.length > 0;

  // Generate initial insights once data is available
  useEffect(() => {
    if (!hasData) {
      setReport(null);
      return;
    }

    let isMounted = true;
    const loadInitial = async () => {
      setIsGenerating(true);
      try {
        const res = await aiInsightsService.generateInsights(summary, topProducts, categories);
        if (isMounted) {
          setReport(res);
        }
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [hasData, summary.totalRevenue, summary.totalOrders, summary.topProduct]);

  const handleManualGenerate = async () => {
    if (!hasData) return;
    setIsGenerating(true);
    try {
      const res = await aiInsightsService.generateInsights(summary, topProducts, categories);
      setReport(res);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `RetailLens AI - Business Insights
Generated: ${report.generatedAt}
Context: ${report.metricsContext.totalRevenue} across ${report.metricsContext.totalOrders} orders

1. EXECUTIVE SUMMARY:
${report.executiveSummary}

2. KEY OBSERVATIONS:
${report.keyObservations.map((o) => `• ${o}`).join('\n')}

3. RECOMMENDED ACTIONS:
${report.recommendedActions.map((a) => `• ${a}`).join('\n')}

4. POTENTIAL RISK:
${report.potentialRisk}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Generate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              AI Business Insights
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              MVP AI Feature
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Understand what your numbers are telling you through automated business analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {report && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Insights'}</span>
            </button>
          )}

          <button
            id="generate-insights-btn"
            onClick={handleManualGenerate}
            disabled={!hasData || isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating
                ? 'Generating Insights...'
                : !hasData
                ? 'Awaiting Data Upload'
                : 'Generate Insights'}
            </span>
          </button>
        </div>
      </div>

      {/* Architectural Separation Banner */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5 sm:mt-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">Processing Architecture:</span>{' '}
            <span>
              Store Sales Ledger &rarr; Deterministic Metric Engine &rarr; AI Business Interpretation.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 shrink-0">
          <span className={`inline-block w-2 h-2 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          <span>{hasData ? 'Deterministic Metrics Verified' : 'No Data Connected'}</span>
        </div>
      </div>

      {/* Main Insights Panel */}
      {!hasData ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Sales Data Available for AI Analysis
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            The AI Business Insights engine generates strategic business interpretations, SKU concentration warnings, and cross-sell recommendations directly from verified store transactions. Upload your store sales CSV in Connect Data to generate live insights.
          </p>
          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Connect Sales Data</span>
            </button>
          )}
        </div>
      ) : isGenerating && !report ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <BrainCircuit className="w-8 h-8 text-indigo-500 animate-pulse mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">Synthesizing business interpretation...</p>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing SKU concentration, category momentum, and transaction velocity.
          </p>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Section 1: Executive Summary - Styled with the clean dark container from the design theme */}
          <div className="bg-slate-900 text-slate-200 p-6 rounded-xl shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. Executive Summary
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Generated {report.generatedAt}</span>
            </div>

            <div className="p-4 bg-slate-800/90 rounded-lg border-l-4 border-indigo-500">
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-normal">
                "{report.executiveSummary}"
              </p>
            </div>
          </div>

          {/* Grid for Key Observations & Recommended Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 2: Key Observations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    2. Key Observations
                  </h3>
                </div>
                <ul className="space-y-3 mt-2 text-xs text-slate-700">
                  {report.keyObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Metric Source: Store Sales Ledger</span>
                <span>4 Key Signals Detected</span>
              </div>
            </div>

            {/* Section 3: Recommended Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    3. Recommended Actions
                  </h3>
                </div>
                <ul className="space-y-3 mt-2 text-xs text-slate-700">
                  {report.recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tactical Merchandising & Inventory</span>
                <span>Priority Actions</span>
              </div>
            </div>
          </div>

          {/* Section 4: Potential Risk */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                4. Potential Risk Alert
              </h3>
            </div>
            <div className="bg-amber-50/80 border-l-4 border-amber-500 rounded-r-lg p-4 text-xs text-amber-950 leading-relaxed">
              {report.potentialRisk}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
