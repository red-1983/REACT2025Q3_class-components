import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };
  const getVisiblePages = () => {
    const visiblePages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();
  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        &larr; Предыдущая
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            className={styles.pageButton}
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className={styles.ellipsis}>...</span>
          )}
          <button
            className={styles.pageButton}
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Следующая &rarr;
      </button>
    </div>
  );
};

export default Pagination;
