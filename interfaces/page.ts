export interface Page<C> {
  content: Array<C>;
  size: number;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  hasContent: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable: Pageable;
  sort: PageSort;
}

export interface Pageable {
  sort: PageSort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
