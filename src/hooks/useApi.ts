'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Hook genérico para chamadas de API
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook para mutações (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  apiFunction: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(params);
      toast.success('Operação realizada com sucesso!');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { mutate, loading, error };
}

// Hook para paginação
export function usePagination<T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(page, limit);
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (page * limit < total) {
      setPage(prev => prev + 1);
    }
  }, [page, limit, total]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  }, [total, limit]);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset para primeira página
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    refetch,
  };
}

// Hook para busca/filtros
export function useSearch<T>(
  apiFunction: (query: string, filters?: any) => Promise<T[]>,
  debounceMs: number = 500
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  // Debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim() || Object.keys(filters).length > 0) {
        try {
          setLoading(true);
          setError(null);
          const result = await apiFunction(query, filters);
          setData(result);
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Erro na busca';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        setData([]);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, filters, apiFunction, debounceMs]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setData([]);
  }, []);

  return {
    data,
    loading,
    error,
    query,
    filters,
    updateQuery,
    updateFilters,
    clearSearch,
  };
}

// Hook para cache local
export function useLocalCache<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(`Erro ao ler cache local para ${key}:`, error);
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValueAndCache = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Erro ao salvar cache local para ${key}:`, error);
        }
      }
      
      return valueToStore;
    });
  }, [key]);

  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValueAndCache, clearCache] as const;
}
