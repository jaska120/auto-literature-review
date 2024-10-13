import { Operation } from "@/utils/operation";

export type Result<T> = {
  currentResult: Operation<T>;
};

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
} & Result<Pagination<T>>;

export interface LiteratureMetadata {
  title: string;
  publication: string;
  publishDate: Date | undefined;
  citedByCount: number | undefined;
  authors: string[];
  keywords: string[];
  abstract: string;
}

export interface IntelligentAnswer {
  answer: string;
}
