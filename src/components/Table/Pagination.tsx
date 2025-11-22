import React, { useCallback } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setCurrentPage, setPageSize } from '../../store/slices/marketingSlice';
import { useTableData } from '../../hooks/useTableData';
import styles from '../../styles/Pagination.module.scss';

export const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagination, hasNextPage, hasPreviousPage } = useTableData();

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPageSize(Number(event.target.value)));
    },
    [dispatch]
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pagination.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(pagination.totalPages);
      } else if (pagination.currentPage >= pagination.totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = pagination.totalPages - 4; i <= pagination.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(pagination.totalPages);
      }
    }

    return pages;
  };

  const startRecord = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endRecord = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.mobileButtons}>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
      <div className={styles.desktopPagination}>
        <div className={styles.paginationInfo}>
          <p className={styles.infoText}>
            Showing <span>{startRecord}</span> to{' '}
            <span>{endRecord}</span> of{' '}
            <span>{pagination.totalRecords}</span> results
          </p>
          <div className={styles.pageSizeSelector}>
            <label htmlFor="pageSize">
              Rows per page:
            </label>
            <select
              id="pageSize"
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
        <div className={styles.paginationControls}>
          <nav aria-label="Pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              <span className="sr-only">Previous</span>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={pagination.currentPage === page ? styles.active : ''}
                >
                  {page}
                </button>
              ) : (
                <span key={index}>
                  {page}
                </span>
              )
            )}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!hasNextPage}
            >
              <span className="sr-only">Next</span>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
