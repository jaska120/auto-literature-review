interface Pagination {
  totalPages: number;
  currentPage: number;
  onPaginate: (page: number) => void;
  hasNextPage: boolean;
}

interface TableProps {
  columns: string[];
  rows: string[][];
  /** If given, the pagination controls are rendered */
  pagination?: Pagination;
}

export function Table({ columns, rows, pagination }: TableProps) {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {columns.map((column) => {
                return (
                  <th
                    key={column}
                    align="left"
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                  >
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => {
              const row = r.slice(0, columns.length);
              return (
                <tr key={row.join()}>
                  {row.map((cell) => {
                    return (
                      <td
                        key={cell}
                        className="whitespace-nowrap px-4 py-2 text-gray-700 text-wrap"
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
        {pagination && (
          <ol className="flex justify-end gap-1 text-xs font-medium">
            {pagination.currentPage > 1 && (
              <li>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                  onClick={() => {
                    pagination.onPaginate(pagination.currentPage - 1);
                  }}
                >
                  <span className="sr-only">Prev Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}

            <li className="block size-8 w-16 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white">
              {pagination.currentPage} of {pagination.totalPages}
            </li>

            {pagination.hasNextPage && (
              <li>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                  onClick={() => {
                    pagination.onPaginate(pagination.currentPage + 1);
                  }}
                >
                  <span className="sr-only">Next Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}
          </ol>
        )}
      </div>
    </div>
  );
}
