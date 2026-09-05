import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyTrendPoint } from '../../types';
import { formatCurrency, formatCompactCurrency, getCurrencySymbol } from '../../utils/currency';

interface RevenueOverTimeChartProps {
  data: DailyTrendPoint[];
}

export const RevenueOverTimeChart: React.FC<RevenueOverTimeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Revenue Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily gross sales performance over selected period</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Gross Sales ({getCurrencySymbol()})
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No sales recorded in this interval
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={(val) => formatCompactCurrency(val)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DailyTrendPoint;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-800">
                        <div className="font-semibold text-slate-300">{item.date}</div>
                        <div className="mt-1 text-sm font-bold text-white">
                          {formatCurrency(item.revenue)}
                        </div>
                        <div className="text-indigo-400 text-[11px] mt-0.5 font-medium">
                          {item.orders} orders ({item.units} units)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
