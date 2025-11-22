import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAppSelector } from '../../store/hooks';
import { selectChartData } from '../../store/slices/marketingSlice';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import styles from '../../styles/PerformanceChart.module.scss';

export const PerformanceChart: React.FC = () => {
  const chartData = useAppSelector(selectChartData);

  const CustomTooltip = useMemo(
    () =>
      ({ active, payload }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className={styles.customTooltip}>
              <p className={styles.tooltipTitle}>{payload[0].payload.name}</p>
              <div className={styles.tooltipContent}>
                <p className={styles.spend}>
                  Spend: <span>{formatCurrency(payload[0].payload.spend)}</span>
                </p>
                <p className={styles.conversions}>
                  Conversions: <span>{formatNumber(payload[0].payload.conversions)}</span>
                </p>
                <p className={styles.clicks}>
                  Clicks: <span>{formatNumber(payload[0].payload.clicks)}</span>
                </p>
                <p className={styles.ctr}>
                  CTR: <span>{payload[0].payload.ctr.toFixed(2)}%</span>
                </p>
              </div>
            </div>
          );
        }
        return null;
      },
    []
  );

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Performance Insights</h2>
        <div className={styles.emptyState}>
          No data available for the selected filters
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Performance Insights - Top Channels</h2>
      
      <div className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>Spend & Conversions by Channel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="spend" fill="#10b981" name="Spend ($)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>Click-Through Rate (CTR) by Channel</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="ctr"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
              name="CTR (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
