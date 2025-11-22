import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { MarketingRecord } from '../../types/marketing.types';
import { formatCurrency, formatNumber, calculateCTR, calculateCPA } from '../../utils/calculations';
import { Pagination } from './Pagination';
import styles from '../../styles/DataTable.module.scss';

interface DataTableProps {
  data: MarketingRecord[];
}

interface GroupedData {
  region: string;
  channels: MarketingRecord[];
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpa: number;
  };
}

interface TreeItem {
  type: 'region' | 'channel';
  region: string;
  data?: MarketingRecord;
  totals?: GroupedData['totals'];
  isExpanded?: boolean;
  level: number;
  isLastChild?: boolean;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: TreeItem[];
    onToggleExpand: (region: string) => void;
  };
}

interface Column {
  key: string;
  header: string;
  width: string;
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const item = data.items[index];
  const isRegion = item.type === 'region';
  
  const handleToggle = () => {
    if (isRegion) {
      data.onToggleExpand(item.region);
    }
  };

  if (isRegion) {
    // Region row (parent)
    return (
      <div 
        style={style} 
        className={`${styles.virtualRow} ${styles.regionRow}`}
        onClick={handleToggle}
      >
        <div className={styles.virtualCell} style={{ flex: '1 1 300px' }}>
          <div className={styles.regionHeader}>
            <svg 
              className={`${styles.expandIcon} ${item.isExpanded ? styles.expanded : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M3 4.5l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.regionName}>{item.region}</span>
          </div>
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatCurrency(item.totals?.spend || 0)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatNumber(item.totals?.impressions || 0)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 120px' }}>
          {formatNumber(item.totals?.clicks || 0)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatNumber(item.totals?.conversions || 0)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 100px' }}>
          {(item.totals?.ctr || 0).toFixed(2)}%
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 120px' }}>
          {formatCurrency(item.totals?.cpa || 0)}
        </div>
      </div>
    );
  } else {
    // Channel row (child)
    const record = item.data!;
    return (
      <div style={style} className={`${styles.virtualRow} ${styles.channelRow}`}>
        <div className={styles.virtualCell} style={{ flex: '1 1 300px' }}>
          <div className={styles.channelHeader}>
            <div className={styles.treeLines}>
              <div className={styles.verticalLine}></div>
              <div className={styles.horizontalLine}></div>
              {item.isLastChild && <div className={styles.cornerLine}></div>}
            </div>
            <span className={styles.channelName}>{record.channel}</span>
          </div>
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatCurrency(record.spend)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatNumber(record.impressions)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 120px' }}>
          {formatNumber(record.clicks)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 140px' }}>
          {formatNumber(record.conversions)}
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 100px' }}>
          {calculateCTR(record.clicks, record.impressions).toFixed(2)}%
        </div>
        <div className={styles.virtualCell} style={{ flex: '0 0 120px' }}>
          {formatCurrency(calculateCPA(record.spend, record.conversions))}
        </div>
      </div>
    );
  }
};

export const VirtualizedDataTable: React.FC<DataTableProps> = ({ data }) => {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Group data by region
  const groupedData = useMemo(() => {
    const groups = new Map<string, MarketingRecord[]>();
    
    data.forEach(record => {
      if (!groups.has(record.region)) {
        groups.set(record.region, []);
      }
      groups.get(record.region)!.push(record);
    });

    return Array.from(groups.entries()).map(([region, channels]) => {
      // Calculate totals for the region
      const totals = channels.reduce(
        (acc, record) => ({
          spend: acc.spend + record.spend,
          impressions: acc.impressions + record.impressions,
          clicks: acc.clicks + record.clicks,
          conversions: acc.conversions + record.conversions,
          ctr: 0, // Will calculate after
          cpa: 0, // Will calculate after
        }),
        { spend: 0, impressions: 0, clicks: 0, conversions: 0, ctr: 0, cpa: 0 }
      );

      // Calculate derived metrics
      totals.ctr = calculateCTR(totals.clicks, totals.impressions);
      totals.cpa = calculateCPA(totals.spend, totals.conversions);

      return {
        region,
        channels,
        totals,
      };
    });
  }, [data]);

  // Create flat tree structure for virtualization
  const treeItems = useMemo(() => {
    const items: TreeItem[] = [];
    
    groupedData.forEach(group => {
      const isExpanded = expandedRegions.has(group.region);
      
      // Add region row
      items.push({
        type: 'region',
        region: group.region,
        totals: group.totals,
        isExpanded,
        level: 0,
      });

      // Add channel rows if expanded
      if (isExpanded) {
        group.channels.forEach((channel, index) => {
          items.push({
            type: 'channel',
            region: group.region,
            data: channel,
            level: 1,
            isLastChild: index === group.channels.length - 1,
          });
        });
      }
    });

    return items;
  }, [groupedData, expandedRegions]);

  const handleToggleExpand = useCallback((region: string) => {
    setExpandedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(region)) {
        newSet.delete(region);
      } else {
        newSet.add(region);
      }
      return newSet;
    });
  }, []);

  const columns: Column[] = useMemo(
    () => [
      { key: 'region', header: 'Region / Channel', width: '' },
      { key: 'spend', header: 'Spend', width: '' },
      { key: 'impressions', header: 'Impressions', width: '' },
      { key: 'clicks', header: 'Clicks', width: '' },
      { key: 'conversions', header: 'Conversions', width: '' },
      { key: 'ctr', header: 'CTR', width: '' },
      { key: 'cpa', header: 'CPA', width: '' },
    ],
    []
  );

  const itemData = useMemo(
    () => ({
      items: treeItems,
      onToggleExpand: handleToggleExpand,
    }),
    [treeItems, handleToggleExpand]
  );

  return (
    <div className={styles.tableContainer} ref={containerRef}>
      <div className={styles.virtualTableWrapper}>
        {/* Header */}
        <div className={styles.virtualHeader}>
          {columns.map((column) => (
            <div
              key={column.key}
              className={styles.virtualHeaderCell}
              style={{ 
                flex: column.key === 'region' ? '1 1 300px' : 
                      column.key === 'clicks' || column.key === 'ctr' ? '0 0 100px' :
                      column.key === 'impressions' || column.key === 'conversions' ? '0 0 140px' :
                      '0 0 120px'
              }}
            >
              <div className={styles.headerContent}>
                {column.header}
              </div>
            </div>
          ))}
        </div>

        {/* Virtualized Body */}
        <List
          height={500}
          itemCount={treeItems.length}
          itemSize={50}
          width={containerWidth || '100%'}
          itemData={itemData}
        >
          {Row}
        </List>
      </div>
      <Pagination />
    </div>
  );
};
