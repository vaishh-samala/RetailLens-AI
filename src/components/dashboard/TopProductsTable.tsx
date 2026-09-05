import React from 'react';
import { ProductPerformance } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TopProductsTableProps {
  products: ProductPerformance[];
  onViewAllProducts?: () => void;
  limit?: number;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products,
  onViewAllProducts,
  limit = 5,
}) => {
  const displayed = limit ? products.slice(0, limit) : products;

  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Star Performer':
        return 'bg-emerald-100 text-emerald-700';
      case 'High Volume':
        return 'bg-blue-100 text-blue-700';
      case 'High Margin':
        return 'bg-indigo-100 text-indigo-700';
      case 'Attention Needed':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-700 text-sm">Top Performing Products</h4>
          <p className="text-xs text-slate-400 mt-0.5">Top-performing retail inventory sorted by revenue</p>
        </div>
        {onViewAllProducts && (
          <button
            onClick={onViewAllProducts}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 hover:underline inline-flex items-center gap-1 transition cursor-pointer"
          >
            <span>View all products</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Units Sold</th>
              <th className="px-6 py-3 text-right">Revenue</th>
              <th className="px-6 py-3 text-right">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-xs">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              displayed.map((p, idx) => (
                <tr
                  key={p.product_name}
                  className={`transition ${idx % 2 === 1 ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'}`}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-900 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      {p.performance_indicator === 'Star Performer' && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className="truncate max-w-xs">{p.product_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs">
                    <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-slate-700 text-xs sm:text-sm">
                    {p.units_sold.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900 text-xs sm:text-sm">
                    {formatCurrency(p.revenue)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(
                        p.performance_indicator
                      )}`}
                    >
                      {p.performance_indicator}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
