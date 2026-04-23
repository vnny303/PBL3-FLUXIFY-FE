import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,           // Data cũ sau 30 giây mới gọi lại API
      retry: 1,                    // Thử lại 1 lần nếu fail
      refetchOnWindowFocus: false, // Không refetch khi chuyển tab
    },
  },
});
