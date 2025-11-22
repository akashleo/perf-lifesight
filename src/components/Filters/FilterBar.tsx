import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setFilters,
  resetFilters,
  selectFilters,
  selectUniqueChannels,
  selectUniqueRegions,
} from '../../store/slices/marketingSlice';
import { SearchInput } from './SearchInput';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import styles from '../../styles/FilterBar.module.scss';

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const channels = useAppSelector(selectUniqueChannels) as string[];
  const regions = useAppSelector(selectUniqueRegions) as string[];

  const handleChannelChange = useCallback(
    (channel: string) => {
      const newChannels = filters.channels.includes(channel)
        ? filters.channels.filter((c) => c !== channel)
        : [...filters.channels, channel];
      dispatch(setFilters({ channels: newChannels }));
    },
    [dispatch, filters.channels]
  );

  const handleRegionChange = useCallback(
    (region: string) => {
      const newRegions = filters.regions.includes(region)
        ? filters.regions.filter((r) => r !== region)
        : [...filters.regions, region];
      dispatch(setFilters({ regions: newRegions }));
    },
    [dispatch, filters.regions]
  );

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const activeFilterCount =
    filters.channels.length + filters.regions.length + (filters.searchQuery ? 1 : 0);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h2>Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset All ({activeFilterCount})
          </button>
        )}
      </div>

      <div className={styles.filterContent}>
        <div className={styles.searchSection}>
          <SearchInput />
        </div>
        
        <div className={styles.filtersRow}>
          <MultiSelectDropdown
            label="Channels"
            options={channels}
            selected={filters.channels}
            onChange={handleChannelChange}
          />
          
          <MultiSelectDropdown
            label="Regions"
            options={regions}
            selected={filters.regions}
            onChange={handleRegionChange}
          />
        </div>
      </div>
    </div>
  );
};
