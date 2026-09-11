import './Pagination.css';

function getPageWindow(current, total, windowSize = 5) {
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = end - windowSize + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ pageNumber, pageSize, totalCount, totalPages, onPageChange }) {
  if (totalCount === 0) return null;

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);
  const pages = getPageWindow(pageNumber, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__summary">
        Showing {start}–{end} of {totalCount}
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        {pages[0] > 1 && (
          <>
            <button className="pagination__btn" onClick={() => onPageChange(1)}>1</button>
            {pages[0] > 2 && <span className="pagination__summary">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__btn ${p === pageNumber ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === pageNumber ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="pagination__summary">…</span>}
            <button className="pagination__btn" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
