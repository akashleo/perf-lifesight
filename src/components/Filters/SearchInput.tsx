import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters, selectFilters } from '../../store/slices/marketingSlice';
import { useDebounce } from '../../hooks/useDebounce';
import styles from '../../styles/SearchInput.module.scss';

export const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const [searchValue, setSearchValue] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    dispatch(setFilters({ searchQuery: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue('');
  }, []);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}>
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search by channel, region, or ID..."
        className={styles.searchInput}
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className={styles.clearButton}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
