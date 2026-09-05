import React, { useState, useMemo } from 'react';
import { ProductPerformance } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { Search, Filter, ArrowUpDown, Sparkles, Layers, DollarSign } from 'lucide-react';

interface ProductPerformanceViewProps {
  products: ProductPerformance[];
}

export const ProductPerformanceView: React.FC<ProductPerformanceViewProps> = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'units' | 'price' | 'name'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'revenue') comp = a.revenue - b.revenue;
      else if (sortBy === 'units') comp = a.units_sold - b.units_sold;
      else if (sortBy === 'price') comp = a.average_price - b.average_price;
      else if (sortBy === 'name') comp = a.product_name.localeCompare(b.product_name);

      return sortOrder === 'desc' ? -comp : comp;
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  const totalCatalogRev = useMemo(() => {
    return products.reduce((acc, p) => acc + p.revenue, 0);
  }, [products]);

  const totalUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + p.units_sold, 0);
  }, [products]);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Product Performance</h2>
        <p className="text-sm text-slate-500 mt-1">
          Detailed sales volume, SKU-level revenue contribution, and performance indicators.
        </p>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Tracked SKUs</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{products.length} Products</div>
          <p className="text-xs text-slate-400 mt-1">active in store dataset</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Catalog Revenue</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(totalCatalogRev)}
          </div>
          <p className="text-xs text-slate-400 mt-1">{totalUnits.toLocaleString()} units sold</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Top SKU Share</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {products[0]?.revenue_share || 0}%
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate">{products[0]?.product_name || 'N/A'}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/70 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs rounded-md border border-slate-200 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="revenue">Product Revenue</option>
            <option value="units">Units Sold</option>
            <option value="price">Unit Price</option>
            <option value="name">Product Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            title={`Toggle ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-right">Avg Unit Price</th>
                <th className="px-4 py-3.5 text-right">Units Sold</th>
                <th className="px-4 py-3.5 text-right">Revenue</th>
                <th className="px-4 py-3.5 text-right">Revenue Share</th>
                <th className="px-6 py-3.5 text-right">Performance Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs">
                    No products matched your search or category filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => (
                  <tr
                    key={p.product_name}
                    className={`transition ${idx % 2 === 1 ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-3.5 font-medium text-slate-900 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        {p.performance_indicator === 'Star Performer' && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-900">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">
                      <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-700 text-xs sm:text-sm">
                      {formatCurrency(p.average_price)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-700 text-xs sm:text-sm">
                      {p.units_sold.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-900 text-xs sm:text-sm">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, p.revenue_share * 2.5)}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-700 w-8 text-right text-xs">
                          {p.revenue_share}%
                        </span>
                      </div>
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
    </div>
  );
};
