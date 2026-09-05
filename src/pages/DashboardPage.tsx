import React, { useState, useMemo } from 'react';
import {
  RawSaleRecord,
  DatasetMeta,
  DashboardTab,
  DateRangePreset,
} from '../types';
import {
  processRawRecords,
  filterRecordsByPreset,
  computeAnalyticsSummary,
  computeDailyTrends,
  computeProductPerformance,
  computeCategoryPerformance,
} from '../services/analytics/analyticsEngine';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { KPICards } from '../components/dashboard/KPICards';
import { RevenueOverTimeChart } from '../components/charts/RevenueOverTimeChart';
import { OrdersOverTimeChart } from '../components/charts/OrdersOverTimeChart';
import { ProductRevenueChart } from '../components/charts/ProductRevenueChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { TopProductsTable } from '../components/dashboard/TopProductsTable';
import { ProductPerformanceView } from '../components/products/ProductPerformanceView';
import { AIInsightsSection } from '../components/ai-insights/AIInsightsSection';
import { DataUploadSection } from '../components/upload/DataUploadSection';
import { FutureRoadmapModal } from '../components/roadmap/FutureRoadmapModal';
import { ContactPage } from './ContactPage';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  rawRecords: RawSaleRecord[];
  datasetMeta: DatasetMeta;
  onDatasetChange: (records: RawSaleRecord[], meta: DatasetMeta) => void;
  onSignOut: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  rawRecords,
  datasetMeta,
  onDatasetChange,
  onSignOut,
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // Deterministically process all raw records
  const processedRecords = useMemo(() => processRawRecords(rawRecords), [rawRecords]);

  // OVERVIEW ANALYTICS: High-level comprehensive overview across the entire store ledger (no date filter pills)
  const overviewSummary = useMemo(
    () => computeAnalyticsSummary(processedRecords, 'all'),
    [processedRecords]
  );
  const overviewDailyTrends = useMemo(
    () => computeDailyTrends(processedRecords),
    [processedRecords]
  );
  const overviewProductPerformances = useMemo(
    () => computeProductPerformance(processedRecords),
    [processedRecords]
  );
  const overviewCategoryPerformances = useMemo(
    () => computeCategoryPerformance(processedRecords),
    [processedRecords]
  );

  // SALES & REVENUE ANALYTICS: Interactive deep dive controlled dynamically by datePreset (7d, 30d, 90d, all)
  const salesActiveRecords = useMemo(
    () => filterRecordsByPreset(processedRecords, datePreset),
    [processedRecords, datePreset]
  );
  const salesSummary = useMemo(
    () => computeAnalyticsSummary(salesActiveRecords, datePreset),
    [salesActiveRecords, datePreset]
  );
  const salesDailyTrends = useMemo(
    () => computeDailyTrends(salesActiveRecords),
    [salesActiveRecords]
  );
  const salesProductPerformances = useMemo(
    () => computeProductPerformance(salesActiveRecords),
    [salesActiveRecords]
  );
  const salesCategoryPerformances = useMemo(
    () => computeCategoryPerformance(salesActiveRecords),
    [salesActiveRecords]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Application Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onSignOut={onSignOut}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentTab={currentTab}
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Store performance overview and key retail metrics.
                  </p>
                </div>

                <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs self-start sm:self-auto">
                  <span>Data Window: </span>
                  <span className="font-semibold text-slate-800">
                    {overviewSummary.startDate || 'N/A'} &rarr; {overviewSummary.endDate || 'N/A'}
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <KPICards summary={overviewSummary} />

              {/* AI Insights Quick Callout Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        AI Business Insights Assistant
                      </span>
                      {overviewSummary.totalOrders > 0 ? (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-200">
                          Awaiting Data
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {overviewSummary.totalOrders > 0
                        ? "Automated business interpretation generated from your store's transactions and SKU metrics."
                        : 'Connect your store sales data in Connect Data to generate automated business interpretation and SKU risk analysis.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="overview-review-insights-btn"
                  onClick={() => setCurrentTab(overviewSummary.totalOrders > 0 ? 'ai-insights' : 'upload')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm shrink-0 cursor-pointer"
                >
                  <span>{overviewSummary.totalOrders > 0 ? 'Review AI Insights' : 'Connect Sales Data'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Time Series Charts: Revenue & Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueOverTimeChart data={overviewDailyTrends} />
                <OrdersOverTimeChart data={overviewDailyTrends} />
              </div>

              {/* Product & Category Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductRevenueChart products={overviewProductPerformances} />
                </div>
                <div className="lg:col-span-1">
                  <CategoryBreakdownChart categories={overviewCategoryPerformances} />
                </div>
              </div>

              {/* Top Products Table */}
              <TopProductsTable
                products={overviewProductPerformances}
                onViewAllProducts={() => setCurrentTab('products')}
                limit={5}
              />
            </div>
          )}

          {/* TAB 2: SALES & REVENUE */}
          {currentTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Sales & Revenue Analytics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    In-depth breakdown of gross sales, order checkouts, average basket sizes, and category yield.
                  </p>
                </div>

                <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs self-start sm:self-auto">
                  <span>Selected Period: </span>
                  <span className="font-semibold text-slate-800">
                    {salesSummary.startDate || 'N/A'} &rarr; {salesSummary.endDate || 'N/A'}
                  </span>
                </div>
              </div>

              {/* KPI Cards dynamically responding to datePreset */}
              <KPICards summary={salesSummary} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueOverTimeChart data={salesDailyTrends} />
                <OrdersOverTimeChart data={salesDailyTrends} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductRevenueChart products={salesProductPerformances} />
                </div>
                <div className="lg:col-span-1">
                  <CategoryBreakdownChart categories={salesCategoryPerformances} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {currentTab === 'products' && (
            <ProductPerformanceView products={overviewProductPerformances} />
          )}

          {/* TAB 4: AI INSIGHTS */}
          {currentTab === 'ai-insights' && (
            <AIInsightsSection
              summary={overviewSummary}
              topProducts={overviewProductPerformances}
              categories={overviewCategoryPerformances}
              onNavigateToUpload={() => setCurrentTab('upload')}
            />
          )}

          {/* TAB 5: DATA UPLOAD / CONNECT DATA */}
          {currentTab === 'upload' && (
            <DataUploadSection
              currentMeta={datasetMeta}
              onDatasetChange={onDatasetChange}
              onNavigateToDashboard={() => setCurrentTab('overview')}
            />
          )}

          {/* TAB 6: CONTACT US */}
          {currentTab === 'contact' && (
            <ContactPage
              isEmbedded={true}
              onBackToHome={() => setCurrentTab('overview')}
            />
          )}
        </main>
      </div>

      {/* Future Roadmap Modal */}
      <FutureRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </div>
  );
};
