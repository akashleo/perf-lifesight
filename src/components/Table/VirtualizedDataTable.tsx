import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSorting, selectSorting } from '../../store/slices/marketingSlice';
import type { MarketingRecord } from '../../types/marketing.types';
import { formatCurrency, formatNumber, calculateCTR, calculateCPA } from '../../utils/calculations';
import { Pagination } from './Pagination';
import styles from '../../styles/DataTable.module.scss';

interface DataTableProps {
  data: MarketingRecord[];
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: MarketingRecord[];
    columns: Column[];
  };
}

interface Column {
  key: keyof MarketingRecord | 'ctr' | 'cpa';
  header: string;
  width: number;
  render?: (record: MarketingRecord) => React.ReactNode;
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const record = data.items[index];
  
  return (
    <div style={style} className={styles.virtualRow}>
      {data.columns.map((column) => (
        <div 
          key={column.key} 
          className={styles.virtualCell}
          style={{ width: column.width }}
        >
          {column.render ? column.render(record) : record[column.key as keyof MarketingRecord]}
        </div>
      ))}
    </div>
  );
};

export const VirtualizedDataTable: React.FC<DataTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const sorting = useAppSelector(selectSorting);

  const handleSort = useCallback(
    (field: keyof MarketingRecord) => {
      if (sorting.field === field) {
        dispatch(
          setSorting({
            field,
            direction: sorting.direction === 'asc' ? 'desc' : 'asc',
          })
        );
      } else {
        dispatch(setSorting({ field, direction: 'asc' }));
      }
    },
    [dispatch, sorting]
  );

  const columns: Column[] = useMemo(
    () => [
      { key: 'id', header: 'ID', width: 80 },
      { 
        key: 'channel', 
        header: 'Channel', 
        width: 120,
        render: (record) => <span className={styles.channelCell}>{record.channel}</span>
      },
      { key: 'region', header: 'Region', width: 140 },
      { 
        key: 'spend', 
        header: 'Spend', 
        width: 120,
        render: (record) => (
          <span className={styles.spendCell}>{formatCurrency(record.spend)}</span>
        )
      },
      { 
        key: 'impressions', 
        header: 'Impressions', 
        width: 120,
        render: (record) => formatNumber(record.impressions)
      },
      { 
        key: 'clicks', 
        header: 'Clicks', 
        width: 100,
        render: (record) => formatNumber(record.clicks)
      },
      { 
        key: 'conversions', 
        header: 'Conversions', 
        width: 120,
        render: (record) => (
          <span className={styles.conversionsCell}>{formatNumber(record.conversions)}</span>
        )
      },
      { 
        key: 'ctr', 
        header: 'CTR', 
        width: 100,
        render: (record) => {
          const ctr = calculateCTR(record.clicks, record.impressions);
          return <span className={styles.ctrCell}>{ctr.toFixed(2)}%</span>;
        }
      },
      { 
        key: 'cpa', 
        header: 'CPA', 
        width: 100,
        render: (record) => {
          const cpa = calculateCPA(record.spend, record.conversions);
          return <span className={styles.cpaCell}>{formatCurrency(cpa)}</span>;
        }
      },
    ],
    []
  );

  const getSortIcon = (field: keyof MarketingRecord) => {
    if (sorting.field !== field) {
      return (
        <svg className={styles.sortIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sorting.direction === 'asc' ? (
      <svg className={styles.sortIconActive} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className={styles.sortIconActive} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const itemData = useMemo(
    () => ({
      items: data,
      columns,
    }),
    [data, columns]
  );

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.virtualTableWrapper}>
        {/* Header */}
        <div className={styles.virtualHeader} style={{ width: totalWidth }}>
          {columns.map((column) => {
            const canSort = column.key !== 'ctr' && column.key !== 'cpa';
            return (
              <div
                key={column.key}
                className={`${styles.virtualHeaderCell} ${canSort ? styles.sortable : ''}`}
                style={{ width: column.width }}
                onClick={() => canSort && handleSort(column.key as keyof MarketingRecord)}
              >
                <div className={styles.headerContent}>
                  {column.header}
                  {canSort && getSortIcon(column.key as keyof MarketingRecord)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Virtualized Body */}
        <List
          height={500}
          itemCount={data.length}
          itemSize={50}
          width={totalWidth}
          itemData={itemData}
        >
          {Row}
        </List>
      </div>
      <Pagination />
    </div>
  );
};
