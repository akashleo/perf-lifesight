import type { MarketingRecord } from '../types/marketing.types';

export const loadMarketingData = async (): Promise<MarketingRecord[]> => {
  try {
    // Use dynamic import for better code splitting
    const response = await fetch('/1. marketing_dashboard_data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const data = await response.json();
    return data as MarketingRecord[];
  } catch (error) {
    console.error('Error loading marketing data:', error);
    throw error;
  }
};

export const aggregateByChannel = (data: MarketingRecord[]) => {
  const channelMap = new Map<
    string,
    {
      spend: number;
      conversions: number;
      clicks: number;
      impressions: number;
      count: number;
    }
  >();

  data.forEach((record) => {
    const existing = channelMap.get(record.channel) || {
      spend: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      count: 0,
    };

    channelMap.set(record.channel, {
      spend: existing.spend + record.spend,
      conversions: existing.conversions + record.conversions,
      clicks: existing.clicks + record.clicks,
      impressions: existing.impressions + record.impressions,
      count: existing.count + 1,
    });
  });

  return Array.from(channelMap.entries()).map(([channel, values]) => ({
    channel,
    ...values,
    avgSpend: values.spend / values.count,
    ctr: values.impressions > 0 ? (values.clicks / values.impressions) * 100 : 0,
    cpa: values.conversions > 0 ? values.spend / values.conversions : 0,
  }));
};

export const aggregateByRegion = (data: MarketingRecord[]) => {
  const regionMap = new Map<
    string,
    {
      spend: number;
      conversions: number;
      clicks: number;
      impressions: number;
      count: number;
    }
  >();

  data.forEach((record) => {
    const existing = regionMap.get(record.region) || {
      spend: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      count: 0,
    };

    regionMap.set(record.region, {
      spend: existing.spend + record.spend,
      conversions: existing.conversions + record.conversions,
      clicks: existing.clicks + record.clicks,
      impressions: existing.impressions + record.impressions,
      count: existing.count + 1,
    });
  });

  return Array.from(regionMap.entries()).map(([region, values]) => ({
    region,
    ...values,
    avgSpend: values.spend / values.count,
    ctr: values.impressions > 0 ? (values.clicks / values.impressions) * 100 : 0,
    cpa: values.conversions > 0 ? values.spend / values.conversions : 0,
  }));
};

export const getTopPerformers = (
  data: MarketingRecord[],
  metric: keyof MarketingRecord,
  limit: number = 10
): MarketingRecord[] => {
  return [...data]
    .sort((a, b) => {
      const aValue = a[metric];
      const bValue = b[metric];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue;
      }
      return 0;
    })
    .slice(0, limit);
};
