import React, { lazy, Suspense } from 'react';
import { useDataLoader } from '../../hooks/useDataLoader';
import { useTableData } from '../../hooks/useTableData';
import { useAppSelector } from '../../store/hooks';
import { selectIsLoading, selectError } from '../../store/slices/marketingSlice';
import { MetricCards } from './MetricCards';
import { FilterBar } from '../Filters/FilterBar';
// import { DataTable } from '../Table/DataTable';
import { VirtualizedDataTable } from '../Table/VirtualizedDataTable';
import styles from '../../styles/Dashboard.module.scss';

// Lazy load the PerformanceChart component
const PerformanceChart = lazy(() => 
  import('./PerformanceChart').then(module => ({ 
    default: module.PerformanceChart 
  }))
);

export const Dashboard: React.FC = () => {
  useDataLoader();
  const { data } = useTableData();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
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
          </div>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>Loading marketing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1>Marketing Dashboard</h1>
              <p>Analyze your marketing performance across channels and regions</p>
            </div>
            <div className={styles.headerBadge}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Performance Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <MetricCards />
        <Suspense fallback={
          <div className={styles.chartLoading}>
            <div className={styles.spinner}></div>
            <p>Loading charts...</p>
          </div>
        }>
          <PerformanceChart />
        </Suspense>
        <FilterBar />
        <VirtualizedDataTable data={data} />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>© 2024 Marketing Dashboard. Built with React, TypeScript, Redux Toolkit & Recharts.</p>
        </div>
      </footer>
    </div>
  );
};
