import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryPerformance } from '../../types';
import { formatCurrency, formatCompactCurrency } from '../../utils/currency';

interface CategoryBreakdownChartProps {
  categories: CategoryPerformance[];
}

const CATEGORY_COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#64748b'];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800">Revenue by Category</h3>
          <span className="text-xs text-slate-400 font-medium">Distribution</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Gross sales contribution by department</p>
      </div>

      <div className="h-52 w-full relative flex items-center justify-center">
        {categories.length === 0 ? (
          <div className="text-slate-400 text-xs">No category data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CategoryPerformance;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-800">
                        <div className="font-semibold text-slate-200">{item.category}</div>
                        <div className="text-sm font-bold mt-1 text-white">
                          {formatCurrency(item.revenue)}
                        </div>
                        <div className="text-indigo-400 text-[11px] mt-0.5 font-medium">
                          {item.revenue_share}% of total ({item.units_sold} units)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Legend List */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
        {categories.slice(0, 5).map((cat, idx) => (
          <div key={cat.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
              />
              <span className="text-slate-700 truncate font-medium">{cat.category}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-slate-900">
                {formatCompactCurrency(cat.revenue)}
              </span>
              <span className="text-slate-400 w-10 text-right">{cat.revenue_share}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
