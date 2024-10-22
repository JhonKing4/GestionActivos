import React from "react";
import "../../styles/Tabla.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
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

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage > delta + 1) {
      rangeWithDots.push(1);
      if (currentPage > delta + 2) {
        rangeWithDots.push("...");
      }
    }

    range.forEach((i) => rangeWithDots.push(i));


    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Mostrando {startItem}-{endItem} de {totalItems} elementos
      </div>
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={handlePrevious}
          aria-label="Previous page"
        >
          ←
        </button>

        {getVisiblePages().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-dots">
              {page}
            </span>
          )
        )}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={handleNext}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
