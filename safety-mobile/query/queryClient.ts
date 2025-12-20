import { QueryClient } from "@tanstack/react-query";

function shouldRetry(failureCount: number, error: unknown) {
  const status = (error as any)?.status as number | undefined;
  if (status && status >= 400 && status < 500 && status !== 429) return false;
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 1000 * 60 * 60 * 24,
      retry: shouldRetry,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 0,
      networkMode: "offlineFirst",
    },
  },
});

