import { useEffect, useState } from 'react';
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

const SEARCH_DEBOUNCE_MS = 400;

interface PageContext<TParams> {
  pageParam: number;
  limit: number;
  /** Debounced search term ('' when empty). */
  search: string;
  dynamicParams?: TParams;
}

interface Options<TPage, TItem, TParams> {
  /** Base key. The search term and dynamicParams are appended automatically. */
  queryKey: QueryKey;
  queryFn: (ctx: PageContext<TParams>) => Promise<TPage>;
  /** Flattens all loaded pages into one list. */
  select: (pages: TPage[]) => TItem[];
  limit?: number;
  /** Extra values the request depends on (filters, ids). Part of the cache key. */
  dynamicParams?: TParams;
  /**
   * Whether another page exists. Default: the last page returned `limit`
   * items. Override when the API returns a total or a `hasMore` flag.
   */
  hasNextPage?: (lastPage: TPage, allPages: TPage[], limit: number) => boolean;
  firstPage?: number;
  staleTime?: number;
  enabled?: boolean;
}

/**
 * Infinite-scroll helper on top of useInfiniteQuery.
 *
 *   const { data, handleScrollToBottom, handleRefetch, ... } = useTodoList();
 *   <FlatList data={data} onEndReached={handleScrollToBottom} onRefresh={handleRefetch} />
 */
export function usePaginatedAPI<TPage, TItem, TParams = undefined>({
  queryKey,
  queryFn,
  select,
  limit = 10,
  dynamicParams,
  hasNextPage,
  firstPage = 1,
  staleTime,
  enabled = true,
}: Options<TPage, TItem, TParams>) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useInfiniteQuery({
    queryKey: [...queryKey, { search: debouncedSearch, limit, ...dynamicParams }],
    queryFn: ({ pageParam }) =>
      queryFn({ pageParam, limit, search: debouncedSearch, dynamicParams }),
    initialPageParam: firstPage,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const more = hasNextPage
        ? hasNextPage(lastPage, allPages, limit)
        : select([lastPage]).length >= limit;
      return more ? lastPageParam + 1 : undefined;
    },
    select: result => select(result.pages),
    staleTime,
    enabled,
  });

  const handleScrollToBottom = () => {
    if (query.hasNextPage && !query.isFetchingNextPage && !query.isFetching) {
      query.fetchNextPage();
    }
  };

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    error: query.error,
    handleScrollToBottom,
    handleRefetch: () => query.refetch(),
    search,
    handleSearch: setSearch,
    resetSearch: () => setSearch(''),
    query,
  };
}

export default usePaginatedAPI;
