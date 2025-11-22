export interface MarketingRecord {
  id: number;
  channel: string;
  region: string;
  spend: number;
  impressions: number;
  conversions: number;
  clicks: number;
}

export interface ComputedMetrics {
  totalSpend: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  overallCTR: number; // Click-Through Rate
  overallCPA: number; // Cost Per Acquisition
  averageROI: number; // Return on Investment
}

export interface Filters {
  channels: string[];
  regions: string[];
  searchQuery: string;
  spendRange: [number, number] | null;
}

export interface SortConfig {
  field: keyof MarketingRecord | null;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface MarketingState {
  rawData: MarketingRecord[];
  filters: Filters;
  sorting: SortConfig;
  pagination: PaginationConfig;
  isLoading: boolean;
  error: string | null;
}

export interface ChartDataPoint {
  name: string;
  spend: number;
  conversions: number;
  clicks: number;
  ctr: number;
}
