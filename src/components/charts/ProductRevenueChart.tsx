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
import { ProductPerformance } from '../../types';
import { formatCurrency, formatCompactCurrency } from '../../utils/currency';

interface ProductRevenueChartProps {
  products: ProductPerformance[];
}

export const ProductRevenueChart: React.FC<ProductRevenueChartProps> = ({ products }) => {
  const topSix = products.slice(0, 6).map((p) => ({
    name: p.product_name.length > 20 ? p.product_name.substring(0, 18) + '...' : p.product_name,
    fullName: p.product_name,
    revenue: p.revenue,
    units: p.units_sold,
    category: p.category,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Revenue by Product</h3>
          <p className="text-xs text-slate-500 mt-0.5">Top contributors to store gross revenue</p>
        </div>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          Top 6 SKUs
        </span>
      </div>

      <div className="h-64 w-full">
        {topSix.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No product sales available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topSix}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={(val) => formatCompactCurrency(val)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-800">
                        <div className="font-semibold text-slate-100">{item.fullName}</div>
                        <div className="text-slate-400 text-[11px]">{item.category}</div>
                        <div className="mt-1 text-sm font-bold text-white">
                          {formatCurrency(item.revenue)}
                        </div>
                        <div className="text-indigo-400 text-[11px] mt-0.5 font-medium">
                          {item.units} units sold
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
