import type { MarketingRecord } from '../types/marketing.types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

export const calculateCPA = (spend: number, conversions: number): number => {
  if (conversions === 0) return 0;
  return spend / conversions;
};

export const calculateROI = (revenue: number, spend: number): number => {
  if (spend === 0) return 0;
  return ((revenue - spend) / spend) * 100;
};

export const calculateConversionRate = (conversions: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
};

export const getSpendRange = (data: MarketingRecord[]): [number, number] => {
  if (data.length === 0) return [0, 0];
  const spends = data.map((record) => record.spend);
  return [Math.min(...spends), Math.max(...spends)];
};

export const getTotalsByField = (data: MarketingRecord[], field: keyof MarketingRecord): number => {
  if (typeof data[0]?.[field] !== 'number') return 0;
  return data.reduce((sum, record) => sum + (record[field] as number), 0);
};
