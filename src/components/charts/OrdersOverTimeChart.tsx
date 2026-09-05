import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyTrendPoint } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface OrdersOverTimeChartProps {
  data: DailyTrendPoint[];
}

export const OrdersOverTimeChart: React.FC<OrdersOverTimeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Orders Over Time</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily volume of placed customer checkouts</p>
        </div>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          Orders Count
        </span>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No order transactions found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DailyTrendPoint;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-800">
                        <div className="font-semibold text-slate-300">{item.date}</div>
                        <div className="mt-1 text-sm font-bold text-white">
                          {item.orders} {item.orders === 1 ? 'Order' : 'Orders'}
                        </div>
                        <div className="text-indigo-400 text-[11px] mt-0.5 font-medium">
                          {item.units} units sold ({formatCurrency(item.revenue)})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
