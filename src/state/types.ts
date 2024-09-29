import { Operation } from "@/utils/operation";

export type Pagination<T = void> = {
  totalResults: number;
  totalPages: number;
  result: T;
  page: number;
  links: {
    self: string;
    first: string | null;
    next: string | null;
    prev: string | null;
    last: string | null;
  };
};

export type PaginatedResult<T> = {
  results: Pagination<T>[];
  currentResult: Operation<Pagination<T>>;
};

export interface LiteratureMetadata {
  title: string;
  publication: string;
  citedByCount: number | undefined;
}
