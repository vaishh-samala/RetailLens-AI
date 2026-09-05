export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: 'google';
  lastLogin: string;
  accessToken?: string;
  tokenExpiry?: number;
}

export interface RawSaleRecord {
  order_id: string;
  order_date: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  customer_id?: string;
  region?: string;
}

export interface ProcessedSaleRecord extends RawSaleRecord {
  total_price: number;
}

export type PerformanceTier = 'Star Performer' | 'High Volume' | 'High Margin' | 'Consistent' | 'Attention Needed';

export interface ProductPerformance {
  product_name: string;
  category: string;
  units_sold: number;
  revenue: number;
  order_count: number;
  average_price: number;
  performance_indicator: PerformanceTier;
  revenue_share: number; // percentage of total
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  units_sold: number;
  order_count: number;
  revenue_share: number;
}

export interface DailyTrendPoint {
  date: string;
  formattedDate: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  unitsSold: number;
  averageOrderValue: number;
  revenueGrowth: number; // percentage vs benchmark/prior
  ordersGrowth: number;
  unitsGrowth: number;
  aovGrowth: number;
  startDate: string;
  endDate: string;
  topCategory: string;
  topProduct: string;
  productConcentrationPct: number; // % revenue from top product
}

export interface AIInsightsReport {
  executiveSummary: string;
  keyObservations: string[];
  recommendedActions: string[];
  potentialRisk: string;
  generatedAt: string;
  metricsContext: {
    totalRevenue: string;
    totalOrders: number;
    topProduct: string;
    topCategory: string;
  };
}

export interface DatasetMeta {
  sourceName: string;
  isDemo: boolean;
  totalRecords: number;
  detectedColumns: string[];
  dateRange: {
    start: string;
    end: string;
  };
  validationStatus: 'valid' | 'warning' | 'invalid' | 'none';
  validationMessage: string;
  missingRequiredCols: string[];
}

export type ActivePage = 'landing' | 'login' | 'dashboard' | 'contact';
export type DashboardTab = 'overview' | 'sales' | 'products' | 'ai-insights' | 'upload' | 'contact';
export type DateRangePreset = '7d' | '30d' | '90d' | 'all';
