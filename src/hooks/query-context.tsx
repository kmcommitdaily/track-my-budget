import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Configured QueryClient with optimized caching strategy.
 * - staleTime: 30 seconds - data is considered fresh for 30s, avoiding unnecessary refetches
 * - gcTime: 5 minutes - cache persists for 5 minutes after last use
 * - refetchOnWindowFocus: false - prevents refetch on tab focus for better UX
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
