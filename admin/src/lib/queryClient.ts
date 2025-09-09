import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include", // Important for session-based auth
        });
        if (!res.ok) {
          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          if (res.status === 401) {
            throw new Error(`${res.status}: ${res.statusText} Unauthorized`);
          }
          const errorText = await res.text();
          throw new Error(`${res.status}: ${errorText || res.statusText}`);
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          return res.text();
        }
      },
    },
  },
});

export { queryClient };

export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: "include", // Important for session-based auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    if (response.status === 401) {
      throw new Error(`${response.status}: ${response.statusText} Unauthorized`);
    }
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText || response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}