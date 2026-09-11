import { LoadingState, EmptyState, ErrorState } from './StateScreens';
import './Table.css';

export function Table({ columns, rows, rowKey, isLoading, error, onRetry, emptyMessage }) {
  if (isLoading) {
    return (
      <div className="table-card">
        <LoadingState label="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-card">
        <ErrorState description={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="table-card">
        <EmptyState
          title="No records found"
          description={emptyMessage || 'Try adjusting your search or filters.'}
        />
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
