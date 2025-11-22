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
import styles from '../../styles/FilterBar.module.scss';

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const channels = useAppSelector(selectUniqueChannels);
  const regions = useAppSelector(selectUniqueRegions);

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
        {/* Search */}
        <SearchInput />

        {/* Channels */}
        <div className={styles.filterSection}>
          <h3>Channels</h3>
          <div className={styles.filterButtons}>
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => handleChannelChange(channel)}
                className={`${styles.channelButton} ${
                  filters.channels.includes(channel) ? styles.active : ''
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className={styles.filterSection}>
          <h3>Regions</h3>
          <div className={styles.filterButtons}>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionChange(region)}
                className={`${styles.regionButton} ${
                  filters.regions.includes(region) ? styles.active : ''
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
