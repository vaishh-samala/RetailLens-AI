import {
  RawSaleRecord,
  ProcessedSaleRecord,
  ProductPerformance,
  CategoryPerformance,
  DailyTrendPoint,
  AnalyticsSummary,
  DateRangePreset,
  PerformanceTier,
} from '../../types';

export function processRawRecords(raw: RawSaleRecord[]): ProcessedSaleRecord[] {
  return raw.map((r) => ({
    ...r,
    quantity: Number(r.quantity) || 0,
    unit_price: Number(r.unit_price) || 0,
    total_price: (Number(r.quantity) || 0) * (Number(r.unit_price) || 0),
  }));
}

export function filterRecordsByPreset(
  records: ProcessedSaleRecord[],
  preset: DateRangePreset
): ProcessedSaleRecord[] {
  if (preset === 'all' || records.length === 0) return records;

  // Find max date in records as reference "current date"
  const dates = records.map((r) => new Date(r.order_date).getTime());
  const maxDate = new Date(Math.max(...dates));

  const daysToSubtract = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
  const cutoff = new Date(maxDate);
  cutoff.setDate(cutoff.getDate() - daysToSubtract);

  return records.filter((r) => new Date(r.order_date) >= cutoff);
}

export function computeAnalyticsSummary(
  records: ProcessedSaleRecord[],
  preset: DateRangePreset
): AnalyticsSummary {
  if (records.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      unitsSold: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      unitsGrowth: 0,
      aovGrowth: 0,
      startDate: '-',
      endDate: '-',
      topCategory: 'None',
      topProduct: 'None',
      productConcentrationPct: 0,
    };
  }

  const totalRevenue = records.reduce((acc, r) => acc + r.total_price, 0);
  const orderIds = new Set(records.map((r) => r.order_id));
  const totalOrders = orderIds.size;
  const unitsSold = records.reduce((acc, r) => acc + r.quantity, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Date range info
  const sortedDates = [...records].sort(
    (a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
  );
  const startDate = sortedDates[0]?.order_date || '';
  const endDate = sortedDates[sortedDates.length - 1]?.order_date || '';

  // Calculate top product and category
  const productMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  for (const r of records) {
    productMap.set(r.product_name, (productMap.get(r.product_name) || 0) + r.total_price);
    categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + r.total_price);
  }

  let topProduct = 'None';
  let topProductRev = 0;
  productMap.forEach((rev, name) => {
    if (rev > topProductRev) {
      topProductRev = rev;
      topProduct = name;
    }
  });

  let topCategory = 'None';
  let topCatRev = 0;
  categoryMap.forEach((rev, cat) => {
    if (rev > topCatRev) {
      topCatRev = rev;
      topCategory = cat;
    }
  });

  const productConcentrationPct = totalRevenue > 0 ? (topProductRev / totalRevenue) * 100 : 0;

  // Deterministic benchmark comparisons based on historical split
  // (Split dataset into first half vs second half or period offset)
  const midPoint = Math.floor(records.length / 2);
  const firstHalf = records.slice(0, midPoint);
  const secondHalf = records.slice(midPoint);

  const prevRev = firstHalf.reduce((acc, r) => acc + r.total_price, 0) || 1;
  const currRev = secondHalf.reduce((acc, r) => acc + r.total_price, 0);
  const revGrowth = ((currRev - prevRev) / prevRev) * 100;

  const prevOrders = new Set(firstHalf.map((r) => r.order_id)).size || 1;
  const currOrders = new Set(secondHalf.map((r) => r.order_id)).size;
  const ordGrowth = ((currOrders - prevOrders) / prevOrders) * 100;

  const prevUnits = firstHalf.reduce((acc, r) => acc + r.quantity, 0) || 1;
  const currUnits = secondHalf.reduce((acc, r) => acc + r.quantity, 0);
  const unGrowth = ((currUnits - prevUnits) / prevUnits) * 100;

  const prevAOV = prevRev / prevOrders;
  const currAOV = currRev / (currOrders || 1);
  const aovGrowth = ((currAOV - prevAOV) / prevAOV) * 100;

  return {
    totalRevenue,
    totalOrders,
    unitsSold,
    averageOrderValue,
    revenueGrowth: Number(revGrowth.toFixed(1)),
    ordersGrowth: Number(ordGrowth.toFixed(1)),
    unitsGrowth: Number(unGrowth.toFixed(1)),
    aovGrowth: Number(aovGrowth.toFixed(1)),
    startDate,
    endDate,
    topCategory,
    topProduct,
    productConcentrationPct: Number(productConcentrationPct.toFixed(1)),
  };
}

export function computeDailyTrends(records: ProcessedSaleRecord[]): DailyTrendPoint[] {
  const map = new Map<string, { revenue: number; orders: Set<string>; units: number }>();

  for (const r of records) {
    const d = r.order_date;
    if (!map.has(d)) {
      map.set(d, { revenue: 0, orders: new Set(), units: 0 });
    }
    const item = map.get(d)!;
    item.revenue += r.total_price;
    item.orders.add(r.order_id);
    item.units += r.quantity;
  }

  const sortedDates = Array.from(map.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return sortedDates.map((date) => {
    const val = map.get(date)!;
    const dObj = new Date(date + 'T00:00:00');
    const formattedDate = dObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return {
      date,
      formattedDate,
      revenue: Number(val.revenue.toFixed(2)),
      orders: val.orders.size,
      units: val.units,
    };
  });
}

export function computeProductPerformance(
  records: ProcessedSaleRecord[]
): ProductPerformance[] {
  const totalRevenue = records.reduce((acc, r) => acc + r.total_price, 0);
  const map = new Map<
    string,
    {
      category: string;
      units_sold: number;
      revenue: number;
      order_ids: Set<string>;
    }
  >();

  for (const r of records) {
    if (!map.has(r.product_name)) {
      map.set(r.product_name, {
        category: r.category,
        units_sold: 0,
        revenue: 0,
        order_ids: new Set(),
      });
    }
    const item = map.get(r.product_name)!;
    item.units_sold += r.quantity;
    item.revenue += r.total_price;
    item.order_ids.add(r.order_id);
  }

  const list: ProductPerformance[] = [];

  map.forEach((val, product_name) => {
    const order_count = val.order_ids.size;
    const average_price = val.units_sold > 0 ? val.revenue / val.units_sold : 0;
    const revenue_share = totalRevenue > 0 ? (val.revenue / totalRevenue) * 100 : 0;

    let performance_indicator: PerformanceTier = 'Consistent';
    if (revenue_share >= 20) {
      performance_indicator = 'Star Performer';
    } else if (val.units_sold >= 15) {
      performance_indicator = 'High Volume';
    } else if (average_price >= 200) {
      performance_indicator = 'High Margin';
    } else if (revenue_share < 5 && val.units_sold < 5) {
      performance_indicator = 'Attention Needed';
    }

    list.push({
      product_name,
      category: val.category,
      units_sold: val.units_sold,
      revenue: Number(val.revenue.toFixed(2)),
      order_count,
      average_price: Number(average_price.toFixed(2)),
      performance_indicator,
      revenue_share: Number(revenue_share.toFixed(1)),
    });
  });

  return list.sort((a, b) => b.revenue - a.revenue);
}

export function computeCategoryPerformance(
  records: ProcessedSaleRecord[]
): CategoryPerformance[] {
  const totalRevenue = records.reduce((acc, r) => acc + r.total_price, 0);
  const map = new Map<
    string,
    { revenue: number; units_sold: number; order_ids: Set<string> }
  >();

  for (const r of records) {
    if (!map.has(r.category)) {
      map.set(r.category, { revenue: 0, units_sold: 0, order_ids: new Set() });
    }
    const item = map.get(r.category)!;
    item.revenue += r.total_price;
    item.units_sold += r.quantity;
    item.order_ids.add(r.order_id);
  }

  const list: CategoryPerformance[] = [];
  map.forEach((val, category) => {
    const share = totalRevenue > 0 ? (val.revenue / totalRevenue) * 100 : 0;
    list.push({
      category,
      revenue: Number(val.revenue.toFixed(2)),
      units_sold: val.units_sold,
      order_count: val.order_ids.size,
      revenue_share: Number(share.toFixed(1)),
    });
  });

  return list.sort((a, b) => b.revenue - a.revenue);
}
