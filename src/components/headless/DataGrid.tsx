/**
 * Headless DataGrid Component
 * 
 * Separates data logic from presentation. Provides state management,
 * loading states, and callbacks, but NO styling.
 * 
 * The consumer provides render props or children function to control the UI.
 * 
 * Usage with render props:
 * <DataGrid
 *   items={movies}
 *   loading={loading}
 *   error={error}
 *   renderItem={(movie) => <MovieCard movie={movie} />}
 *   renderLoading={() => <Spinner />}
 *   renderError={(err) => <ErrorMessage message={err} />}
 *   renderEmpty={() => <NoMovies />}
 * />
 * 
 * Usage with children function (more flexible):
 * <DataGrid items={movies} loading={loading} error={error}>
 *   {({ items, loading, error }) => (
 *     <div className="my-custom-layout">
 *       {loading && <Skeleton count={5} />}
 *       {error && <Alert type="error">{error}</Alert>}
 *       {!loading && !error && items.map(item => <MovieCard key={item.id} movie={item} />)}
 *     </div>
 *   )}
 * </DataGrid>
 */

import type { ReactNode, Key } from 'react';

// Generic item type that requires at least an id
interface WithId {
  id: string | number;
}

// --- Render Props Pattern ---

interface DataGridRenderProps<T extends WithId> {
  items: T[];
  loading?: boolean;
  error?: string | null;
  renderItem: (item: T, index: number) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: string) => ReactNode;
  renderEmpty?: () => ReactNode;
  keyExtractor?: (item: T, index: number) => Key;
  className?: string;
}

export function DataGrid<T extends WithId>({
  items,
  loading = false,
  error = null,
  renderItem,
  renderLoading,
  renderError,
  renderEmpty,
  keyExtractor,
  className,
}: DataGridRenderProps<T>) {
  // Error state
  if (error && renderError) {
    return <>{renderError(error)}</>;
  }

  // Loading state (with no data)
  if (loading && items.length === 0 && renderLoading) {
    return <>{renderLoading()}</>;
  }

  // Empty state
  if (items.length === 0 && renderEmpty) {
    return <>{renderEmpty()}</>;
  }

  // Main render
  return (
    <div className={className} role="grid">
      {items.map((item, index) => (
        <div key={keyExtractor?.(item, index) ?? item.id} role="row">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// --- Children Function Pattern (more flexible) ---

interface DataGridState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
}

interface DataGridChildrenProps<T extends WithId> {
  items: T[];
  loading?: boolean;
  error?: string | null;
  children: (state: DataGridState<T>) => ReactNode;
}

export function DataGridWithChildren<T extends WithId>({
  items,
  loading = false,
  error = null,
  children,
}: DataGridChildrenProps<T>) {
  const state: DataGridState<T> = {
    items,
    loading,
    error,
    isEmpty: items.length === 0,
  };

  return <>{children(state)}</>;
}

// --- Hook for building custom DataGrids ---

interface UseDataGridOptions<T extends WithId> {
  items: T[];
  loading?: boolean;
  error?: string | null;
  filterFn?: (item: T) => boolean;
  sortFn?: (a: T, b: T) => number;
  pageSize?: number;
}

interface UseDataGridResult<T extends WithId> {
  items: T[];
  filteredItems: T[];
  paginatedItems: T[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalCount: number;
  filteredCount: number;
  currentPage: number;
  setPage: (page: number) => number;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Note: In a real implementation, you'd use useState for pagination
// This is a simplified version for demonstration
export function useDataGrid<T extends WithId>({
  items,
  loading = false,
  error = null,
  filterFn,
  sortFn,
  pageSize,
}: UseDataGridOptions<T>): UseDataGridResult<T> {
  // Apply filtering
  const filteredItems = filterFn ? items.filter(filterFn) : items;

  // Apply sorting
  const sortedItems = sortFn ? [...filteredItems].sort(sortFn) : filteredItems;

  // Apply pagination (simplified - no state for demo)
  const currentPage = 1;
  const paginatedItems = pageSize
    ? sortedItems.slice(0, pageSize)
    : sortedItems;

  const totalCount = items.length;
  const filteredCount = filteredItems.length;
  const isEmpty = items.length === 0;

  // Pagination helpers (simplified)
  const setPage = (page: number) => page;
  const nextPage = () => {};
  const prevPage = () => {};
  const hasNextPage = pageSize ? sortedItems.length > pageSize : false;
  const hasPrevPage = false;

  return {
    items: sortedItems,
    filteredItems: sortedItems,
    paginatedItems,
    loading,
    error,
    isEmpty,
    totalCount,
    filteredCount,
    currentPage,
    setPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
}

export type { DataGridState, DataGridRenderProps, DataGridChildrenProps };
export default DataGrid;
