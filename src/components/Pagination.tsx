'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);

    // Smooth scroll to top of feed
    const feedElement = document.getElementById('repository-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Repository pagination"
      className="w-full max-w-4xl mx-auto mt-8 mb-6 font-mono text-xs"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
        
        {/* Item Range Info */}
        <div className="text-slate-400 text-center sm:text-left">
          <span>Showing </span>
          <strong className="text-emerald-400">{startItem}–{endItem}</strong>
          <span> of </span>
          <strong className="text-slate-200">{totalItems}</strong>
          <span> repositories</span>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex items-center space-x-1.5 flex-wrap justify-center">
          
          {/* Previous Button */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
              currentPage === 1
                ? 'bg-slate-950/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
            }`}
            aria-label="Go to previous page"
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1.5 text-slate-600 select-none font-bold"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-lg font-bold transition-all border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
              currentPage === totalPages
                ? 'bg-slate-950/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
            }`}
            aria-label="Go to next page"
          >
            Next →
          </button>

        </div>

      </div>
    </nav>
  );
};
