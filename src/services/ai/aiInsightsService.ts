import {
  AIInsightsReport,
  AnalyticsSummary,
  ProductPerformance,
  CategoryPerformance,
} from '../../types';
import { formatCurrency } from '../../utils/currency';

export class AIInsightsService {
  /**
   * Generates business interpretation strictly from calculated metrics.
   * Demonstrates the architecture: Sales data -> deterministic metrics -> AI interpretation.
   */
  public async generateInsights(
    summary: AnalyticsSummary,
    topProducts: ProductPerformance[],
    categories: CategoryPerformance[]
  ): Promise<AIInsightsReport> {
    // Simulate AI synthesis latency
    await new Promise((resolve) => setTimeout(resolve, 850));

    const topProduct = topProducts[0]?.product_name || 'Top Product';
    const topProdShare = topProducts[0]?.revenue_share || 0;
    const topCategory = categories[0]?.category || 'Primary Category';
    const topCatShare = categories[0]?.revenue_share || 0;
    const revFormatted = formatCurrency(summary.totalRevenue, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    // Executive Summary
    const growthTrend = summary.revenueGrowth >= 0 ? 'expanding' : 'contracting';
    const growthDescriptor =
      summary.revenueGrowth >= 15
        ? 'at a rapid pace'
        : summary.revenueGrowth >= 0
        ? 'at a steady trajectory'
        : 'with margin compression';

    const executiveSummary =
      `Revenue is currently ${growthTrend} ${growthDescriptor}, achieving ${revFormatted} across ${summary.totalOrders} verified orders. Store performance is heavily anchored by ${topCategory} (${topCatShare}% of sales), with ${topProduct} acting as the primary volume driver. Overall average basket size holds at ${formatCurrency(summary.averageOrderValue)}.`;

    // Key Observations
    const keyObservations: string[] = [
      summary.revenueGrowth >= 0
        ? `Revenue expanded by +${summary.revenueGrowth}% compared with prior period benchmark, with unit velocity up +${summary.unitsGrowth}%.`
        : `Revenue adjusted by ${summary.revenueGrowth}% compared with prior period; order volume decreased by ${Math.abs(summary.ordersGrowth)}%.`,
      `Product concentration is high: "${topProduct}" accounts for ${topProdShare}% of gross store revenue.`,
      `Category leader is "${topCategory}" contributing ${formatCurrency(categories[0]?.revenue || 0, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} across ${categories[0]?.units_sold || 0} units sold.`,
      `Average Order Value (AOV) sits at ${formatCurrency(summary.averageOrderValue)} (${summary.aovGrowth >= 0 ? '+' : ''}${summary.aovGrowth}% trend), signaling solid customer purchasing power per transaction.`,
    ];

    if (categories.length > 1) {
      const secondCategory = categories[1];
      keyObservations.push(
        `Secondary category "${secondCategory.category}" delivers ${formatCurrency(secondCategory.revenue, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} (${secondCategory.revenue_share}%), presenting an immediate cross-sell vector.`
      );
    }

    // Recommended Actions
    const recommendedActions: string[] = [
      `Secure buffer stock for "${topProduct}" to prevent stockouts during demand peaks, as it drives over ${topProdShare}% of total gross volume.`,
      `Design category-specific bundles pairing "${topCategory}" bestsellers with lagging accessories to lift basket size above ${formatCurrency(summary.averageOrderValue * 1.15)}.`,
      `Investigate pricing elasticity or promotional cadence on products flagged with low velocity to release stagnant working capital.`,
      `Segment high-ticket order buyers from ${topCategory} into VIP re-engagement journeys to accelerate repeat purchase velocity.`,
    ];

    // Potential Risk
    const potentialRisk =
      topProdShare >= 25
        ? `Revenue concentration in "${topProduct}" (${topProdShare}% of total revenue) creates acute single-SKU vulnerability. Any supply bottleneck, manufacturer delay, or ad fatigue on this item will disproportionately hurt monthly cash flow.`
        : `While product diversity is balanced, store health remains sensitive to category demand shifts in ${topCategory}. Maintaining healthy gross margins requires monitoring unit cost fluctuations closely.`;

    return {
      executiveSummary,
      keyObservations,
      recommendedActions,
      potentialRisk,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metricsContext: {
        totalRevenue: revFormatted,
        totalOrders: summary.totalOrders,
        topProduct,
        topCategory,
      },
    };
  }
}

export const aiInsightsService = new AIInsightsService();
