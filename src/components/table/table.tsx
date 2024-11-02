import { useState, Fragment } from "react";
import { CaretRightIcon } from "@/components/icon/caret-right-icon";

interface Pagination {
  totalPages: number;
  currentPage: number;
  onPaginate: (page: number) => void;
  hasNextPage: boolean;
}

interface TableProps {
  columns: string[];
  rows: string[][];
  collapse?: {
    columns: string[];
    rows: string[][];
  };
  /** If given, the pagination controls are rendered */
  pagination?: Pagination;
}

const cellWidths = ["w-2/5", "w-2/5", "w-auto", "w-auto"];

export function Table({ columns, rows, pagination, collapse }: TableProps) {
  const [collapsed, setCollapsed] = useState<boolean[]>(rows.map(() => true));

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {collapse && (
                <th align="left" className="px-4 py-2" aria-label="Expand or collapse" />
              )}
              {columns.map((column, columnIndex) => {
                return (
                  <th
                    key={column}
                    align={columns.length === columnIndex + 1 ? "right" : "left"}
                    className={`${cellWidths[columnIndex]} whitespace-nowrap px-4 py-2 font-medium text-gray-900`}
                  >
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map((r, i) => {
              const row = r.slice(0, columns.length);
              const isCollapsed = collapsed[i];

              return (
                <Fragment key={row.join()}>
                  <tr>
                    {collapse && (
                      <td
                        align="center"
                        className="px-4 py-2"
                        onClick={() =>
                          setCollapsed((collapsedArray) => {
                            const arr = [...collapsedArray];
                            arr[i] = !arr[i]; // toggle the collapse state
                            return arr;
                          })
                        }
                      >
                        {isCollapsed ? (
                          <CaretRightIcon className="size-4 rotate-90" aria-label="Expand" />
                        ) : (
                          <CaretRightIcon className="size-4 -rotate-90" aria-label="Collapse" />
                        )}
                      </td>
                    )}
                    {row.map((cell, j) => (
                      <td
                        align={columns.length === j + 1 ? "right" : "left"}
                        key={`${columns[j]}-${cell}`}
                        className="whitespace-nowrap px-4 py-2 text-gray-700 text-wrap"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>

                  {/* Render additional details when expanded */}
                  {!isCollapsed && collapse && collapse.rows[i] && (
                    <tr key={`collapse-${row.join()}`} className="bg-gray-50">
                      <td colSpan={columns.length + 1} className="p-4">
                        {collapse.columns.map((column, k) => (
                          <div key={`collapse-content-${collapse.rows[i].join()}`}>
                            <p>
                              <strong>{column}</strong>
                            </p>
                            <p className={collapse.columns.length === k + 1 ? "mb-0" : "mb-4"}>
                              {collapse.rows[i][k]}
                            </p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
                  <CaretRightIcon className="rotate-180 h-3 w-3" />
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
                  <CaretRightIcon className="h-3 w-3" />
                </button>
              </li>
            )}
          </ol>
        )}
      </div>
    </div>
  );
}
