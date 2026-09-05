import React from 'react';
import { AnalyticsSummary } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { DollarSign, ShoppingBag, Layers, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardsProps {
  summary: AnalyticsSummary;
}

export const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  const hasData = summary.totalOrders > 0;

  const cards = [
    {
      id: 'kpi-total-revenue',
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      change: summary.revenueGrowth,
      icon: DollarSign,
      caption: hasData ? 'vs previous period' : 'Awaiting data',
      color: 'text-neutral-900',
    },
    {
      id: 'kpi-total-orders',
      label: 'Total Orders',
      value: summary.totalOrders.toLocaleString(),
      change: summary.ordersGrowth,
      icon: ShoppingBag,
      caption: hasData ? 'completed store orders' : 'Awaiting data',
      color: 'text-neutral-900',
    },
    {
      id: 'kpi-units-sold',
      label: 'Units Sold',
      value: summary.unitsSold.toLocaleString(),
      change: summary.unitsGrowth,
      icon: Layers,
      caption: hasData ? 'products delivered' : 'Awaiting data',
      color: 'text-neutral-900',
    },
    {
      id: 'kpi-average-order-value',
      label: 'Average Order Value',
      value: formatCurrency(summary.averageOrderValue),
      change: summary.aovGrowth,
      icon: TrendingUp,
      caption: hasData ? 'revenue per checkout' : 'Awaiting data',
      color: 'text-neutral-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        return (
          <div
            key={card.id}
            id={card.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              {hasData ? (
                <span
                  className={`inline-flex items-center gap-0.5 font-medium ${
                    isPositive ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {card.change}% vs last period
                  </span>
                </span>
              ) : (
                <span className="text-slate-400 font-medium">—</span>
              )}
              <span className="text-slate-400 text-[11px]">{card.caption}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
