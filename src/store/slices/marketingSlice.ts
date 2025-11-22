import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { MarketingRecord, MarketingState, Filters, SortConfig } from '../../types/marketing.types';

const initialState: MarketingState = {
  rawData: [],
  filters: {
    channels: [],
    regions: [],
    searchQuery: '',
    spendRange: null,
  },
  sorting: {
    field: null,
    direction: 'asc',
  },
  pagination: {
    currentPage: 1,
    pageSize: 50,
    totalPages: 0,
    totalRecords: 0,
  },
  isLoading: false,
  error: null,
};

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<MarketingRecord[]>) => {
      state.rawData = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page on filter change
    },
    setSorting: (state, action: PayloadAction<SortConfig>) => {
      state.sorting = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },
    updatePaginationMeta: (state, action: PayloadAction<{ totalPages: number; totalRecords: number }>) => {
      state.pagination.totalPages = action.payload.totalPages;
      state.pagination.totalRecords = action.payload.totalRecords;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilters,
  setSorting,
  setCurrentPage,
  setPageSize,
  updatePaginationMeta,
  resetFilters,
} = marketingSlice.actions;

// Basic selectors
export const selectRawData = (state: RootState) => state.marketing.rawData;
export const selectFilters = (state: RootState) => state.marketing.filters;
export const selectSorting = (state: RootState) => state.marketing.sorting;
export const selectPagination = (state: RootState) => state.marketing.pagination;
export const selectIsLoading = (state: RootState) => state.marketing.isLoading;
export const selectError = (state: RootState) => state.marketing.error;

// Memoized selector for unique channels
export const selectUniqueChannels = createSelector([selectRawData], (data) => {
  const channels = new Set(data.map((record) => record.channel));
  return Array.from(channels).sort();
});

// Memoized selector for unique regions
export const selectUniqueRegions = createSelector([selectRawData], (data) => {
  const regions = new Set(data.map((record) => record.region));
  return Array.from(regions).sort();
});

// Memoized selector for filtered data
export const selectFilteredData = createSelector(
  [selectRawData, selectFilters],
  (data, filters) => {
    return data.filter((record) => {
      // Channel filter
      if (filters.channels.length > 0 && !filters.channels.includes(record.channel)) {
        return false;
      }

      // Region filter
      if (filters.regions.length > 0 && !filters.regions.includes(record.region)) {
        return false;
      }

      // Search query filter (searches across all text fields)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${record.channel} ${record.region} ${record.id}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Spend range filter
      if (filters.spendRange) {
        const [min, max] = filters.spendRange;
        if (record.spend < min || record.spend > max) {
          return false;
        }
      }

      return true;
    });
  }
);

// Memoized selector for sorted data
export const selectSortedData = createSelector(
  [selectFilteredData, selectSorting],
  (data, sorting) => {
    if (!sorting.field) return data;

    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const aValue = a[sorting.field!];
      const bValue = b[sorting.field!];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sortedData;
  }
);

// Memoized selector for paginated data
export const selectPaginatedData = createSelector(
  [selectSortedData, selectPagination],
  (data, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  }
);

// Memoized selector for computed metrics
export const selectComputedMetrics = createSelector([selectFilteredData], (data) => {
  if (data.length === 0) {
    return {
      totalSpend: 0,
      totalConversions: 0,
      totalImpressions: 0,
      totalClicks: 0,
      overallCTR: 0,
      overallCPA: 0,
      averageROI: 0,
    };
  }

  const totals = data.reduce(
    (acc, record) => ({
      spend: acc.spend + record.spend,
      conversions: acc.conversions + record.conversions,
      impressions: acc.impressions + record.impressions,
      clicks: acc.clicks + record.clicks,
    }),
    { spend: 0, conversions: 0, impressions: 0, clicks: 0 }
  );

  const overallCTR = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  const overallCPA = totals.conversions > 0 ? totals.spend / totals.conversions : 0;
  const averageROI = totals.spend > 0 ? ((totals.conversions * 100 - totals.spend) / totals.spend) * 100 : 0;

  return {
    totalSpend: totals.spend,
    totalConversions: totals.conversions,
    totalImpressions: totals.impressions,
    totalClicks: totals.clicks,
    overallCTR,
    overallCPA,
    averageROI,
  };
});

// Memoized selector for chart data (top 10 channels by spend)
export const selectChartData = createSelector([selectFilteredData], (data) => {
  // Aggregate by channel
  const channelMap = new Map<string, { spend: number; conversions: number; clicks: number; impressions: number }>();

  data.forEach((record) => {
    const existing = channelMap.get(record.channel) || { spend: 0, conversions: 0, clicks: 0, impressions: 0 };
    channelMap.set(record.channel, {
      spend: existing.spend + record.spend,
      conversions: existing.conversions + record.conversions,
      clicks: existing.clicks + record.clicks,
      impressions: existing.impressions + record.impressions,
    });
  });

  // Convert to array and sort by spend
  const chartData = Array.from(channelMap.entries())
    .map(([name, values]) => ({
      name,
      spend: Math.round(values.spend * 100) / 100,
      conversions: values.conversions,
      clicks: values.clicks,
      ctr: values.impressions > 0 ? (values.clicks / values.impressions) * 100 : 0,
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 10);

  return chartData;
});

export default marketingSlice.reducer;
