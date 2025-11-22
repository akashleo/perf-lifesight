import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectPaginatedData,
  selectSortedData,
  selectPagination,
  updatePaginationMeta,
} from '../store/slices/marketingSlice';

export const useTableData = () => {
  const dispatch = useAppDispatch();
  const paginatedData = useAppSelector(selectPaginatedData);
  const sortedData = useAppSelector(selectSortedData);
  const pagination = useAppSelector(selectPagination);

  // Update pagination metadata when sorted data changes
  useEffect(() => {
    const totalRecords = sortedData.length;
    const totalPages = Math.ceil(totalRecords / pagination.pageSize);

    dispatch(
      updatePaginationMeta({
        totalPages,
        totalRecords,
      })
    );
  }, [sortedData.length, pagination.pageSize, dispatch]);

  const hasNextPage = useMemo(
    () => pagination.currentPage < pagination.totalPages,
    [pagination.currentPage, pagination.totalPages]
  );

  const hasPreviousPage = useMemo(() => pagination.currentPage > 1, [pagination.currentPage]);

  return {
    data: paginatedData,
    pagination,
    hasNextPage,
    hasPreviousPage,
  };
};
