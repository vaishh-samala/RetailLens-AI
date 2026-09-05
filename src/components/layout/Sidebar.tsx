import React from 'react';
import { DashboardTab } from '../../types';
import { useAuth } from '../../services/auth/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Sparkles,
  UploadCloud,
  Eye,
  LogOut,
  Compass,
  Mail,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenRoadmap: () => void;
  onSignOut?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenRoadmap,
  onSignOut,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, signOut } = useAuth();

  const navItems: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & Revenue', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    { id: 'upload', label: 'Connect Data', icon: UploadCloud },
  ];

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
    }
  };

  const content = (
    <div className="flex flex-col h-full justify-between bg-white border-r border-slate-200 w-64 select-none">
      {/* Top Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            id="sidebar-brand-btn"
            onClick={() => {
              onTabChange('overview');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-2.5 text-left group transition cursor-pointer"
            title="Navigate to Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-tight group-hover:text-indigo-600 transition">
                RetailLens AI
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Ecommerce Analytics
              </p>
            </div>
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Core Analytics
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-indigo-700'
                      : item.id === 'ai-insights'
                      ? 'text-indigo-600'
                      : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'ai-insights' && (
                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-indigo-200/70 text-indigo-800' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Roadmap Teaser */}
        <div className="px-4 pt-1">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Future Roadmap</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              5 advanced intelligence modules scheduled next.
            </p>
            <button
              onClick={onOpenRoadmap}
              className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Roadmap</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Support Navigation: Contact Us */}
        <div className="px-4 pt-3">
          <button
            type="button"
            id="sidebar-nav-contact"
            onClick={() => {
              onTabChange('contact');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              currentTab === 'contact'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Mail
              className={`w-4 h-4 shrink-0 ${
                currentTab === 'contact' ? 'text-indigo-700' : 'text-slate-500'
              }`}
            />
            <span className="truncate">Contact Us</span>
          </button>
        </div>
      </div>

      {/* Bottom User Profile & Sign Out */}
      <div className="mt-auto p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User avatar'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name || 'Authenticated User'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'Google Account'}
            </p>
          </div>
        </div>
        <button
          id="sidebar-signout-btn"
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
