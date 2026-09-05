import React from 'react';
import { DashboardTab, DateRangePreset } from '../../types';
import { Menu, Calendar } from 'lucide-react';

interface NavbarProps {
  currentTab: DashboardTab;
  datePreset: DateRangePreset;
  onDatePresetChange: (preset: DateRangePreset) => void;
  onOpenMobileSidebar: () => void;
  onOpenRoadmap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  datePreset,
  onDatePresetChange,
  onOpenMobileSidebar,
}) => {
  const presets: { id: DateRangePreset; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const getPageTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Overview';
      case 'sales':
        return 'Sales & Revenue';
      case 'products':
        return 'Products';
      case 'ai-insights':
        return 'AI Business Insights';
      case 'upload':
        return 'Connect Data';
      case 'contact':
        return 'Contact Us';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Store performance & key metrics';
      case 'sales':
        return 'Financial analytics & revenue trends';
      case 'products':
        return 'Catalog performance & SKU analysis';
      case 'ai-insights':
        return 'Automated business intelligence';
      case 'upload':
        return 'Import and manage store sales data';
      case 'contact':
        return 'Have a question, need help, or want to learn more about RetailLens AI? Send us a message and our team will get back to you.';
      default:
        return '';
    }
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
      {/* Left: Mobile hamburger & Page contextual heading */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline gap-2.5">
          <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            {getPageTitle()}
          </span>
          <span className="hidden md:inline-block text-xs text-slate-400 font-normal">
            &bull; {getPageSubtitle()}
          </span>
        </div>
      </div>

      {/* Right: Page-specific controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date range picker: ONLY displayed on Sales & Revenue page */}
        {currentTab === 'sales' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 hidden sm:inline-block" />
            {presets.map((p) => {
              const active = datePreset === p.id;
              return (
                <button
                  key={p.id}
                  id={`sales-filter-${p.id}`}
                  onClick={() => onDatePresetChange(p.id)}
                  className={`px-2.5 py-1 rounded text-[11px] sm:text-xs transition cursor-pointer font-medium ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
