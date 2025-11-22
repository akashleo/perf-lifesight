import React, { useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectComputedMetrics } from '../../store/slices/marketingSlice';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/calculations';
import styles from '../../styles/MetricCards.module.scss';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colorClass = color.replace('text-', '');
  
  return (
    <div className={styles.metricCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardText}>
          <p className={styles.cardTitle}>{title}</p>
          <p className={`${styles.cardValue} ${styles[colorClass]}`}>{value}</p>
        </div>
        <div className={`${styles.cardIcon} ${styles[colorClass]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const MetricCards: React.FC = () => {
  const metrics = useAppSelector(selectComputedMetrics);

  const cards = useMemo(
    () => [
      {
        title: 'Total Spend',
        value: formatCurrency(metrics.totalSpend),
        color: 'text-green-600',
        icon: (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: 'Total Conversions',
        value: formatNumber(metrics.totalConversions),
        color: 'text-blue-600',
        icon: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: 'Total Impressions',
        value: formatNumber(metrics.totalImpressions),
        color: 'text-purple-600',
        icon: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ),
      },
      {
        title: 'Total Clicks',
        value: formatNumber(metrics.totalClicks),
        color: 'text-orange-600',
        icon: (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        ),
      },
      {
        title: 'Overall CTR',
        value: formatPercentage(metrics.overallCTR),
        color: 'text-indigo-600',
        icon: (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        ),
      },
      {
        title: 'Overall CPA',
        value: formatCurrency(metrics.overallCPA),
        color: 'text-pink-600',
        icon: (
          <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
    [metrics]
  );

  return (
    <div className={styles.metricsGrid}>
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
};
