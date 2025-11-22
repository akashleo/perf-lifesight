import React, { useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSorting, selectSorting } from '../../store/slices/marketingSlice';
import type { MarketingRecord } from '../../types/marketing.types';
import { formatCurrency, formatNumber, calculateCTR, calculateCPA } from '../../utils/calculations';
import { Pagination } from './Pagination';
import styles from '../../styles/DataTable.module.scss';

interface DataTableProps {
  data: MarketingRecord[];
}

const columnHelper = createColumnHelper<MarketingRecord>();

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const sorting = useAppSelector(selectSorting);

  const handleSort = useCallback(
    (field: keyof MarketingRecord) => {
      if (sorting.field === field) {
        // Toggle direction
        dispatch(
          setSorting({
            field,
            direction: sorting.direction === 'asc' ? 'desc' : 'asc',
          })
        );
      } else {
        // New field, default to ascending
        dispatch(setSorting({ field, direction: 'asc' }));
      }
    },
    [dispatch, sorting]
  );

  const columns = useMemo<ColumnDef<MarketingRecord, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 80,
      }),
      columnHelper.accessor('channel', {
        header: 'Channel',
        cell: (info) => (
          <span className={styles.channelCell}>{info.getValue()}</span>
        ),
        size: 120,
      }),
      columnHelper.accessor('region', {
        header: 'Region',
        cell: (info) => info.getValue(),
        size: 140,
      }),
      columnHelper.accessor('spend', {
        header: 'Spend',
        cell: (info) => (
          <span className={styles.spendCell}>
            {formatCurrency(info.getValue())}
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor('impressions', {
        header: 'Impressions',
        cell: (info) => formatNumber(info.getValue()),
        size: 120,
      }),
      columnHelper.accessor('clicks', {
        header: 'Clicks',
        cell: (info) => formatNumber(info.getValue()),
        size: 100,
      }),
      columnHelper.accessor('conversions', {
        header: 'Conversions',
        cell: (info) => (
          <span className={styles.conversionsCell}>
            {formatNumber(info.getValue())}
          </span>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'ctr',
        header: 'CTR',
        cell: (props) => {
          const ctr = calculateCTR(props.row.original.clicks, props.row.original.impressions);
          return <span className={styles.ctrCell}>{ctr.toFixed(2)}%</span>;
        },
        size: 100,
      }),
      columnHelper.display({
        id: 'cpa',
        header: 'CPA',
        cell: (props) => {
          const cpa = calculateCPA(props.row.original.spend, props.row.original.conversions);
          return <span className={styles.cpaCell}>{formatCurrency(cpa)}</span>;
        },
        size: 100,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

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

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.id !== 'ctr' && header.column.id !== 'cpa';
                  return (
                    <th
                      key={header.id}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`${styles.headerContent} ${
                            canSort ? styles.sortable : ''
                          }`}
                          onClick={() =>
                            canSort && handleSort(header.column.id as keyof MarketingRecord)
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && getSortIcon(header.column.id as keyof MarketingRecord)}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
};
