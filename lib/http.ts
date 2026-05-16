import axios, { AxiosRequestConfig } from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,         // send cookie automatically on every request
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ── 401 interceptor: auto-refresh then retry ─────────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401) return Promise.reject(error);

    if (originalRequest._retry) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: () => resolve(http({ ...originalRequest, _retry: true })),
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      await http.post('/api/auth/refresh');

      pendingQueue.forEach((p) => p.resolve(undefined));
      pendingQueue = [];

      return http({ ...originalRequest, _retry: true });
    } catch {
      pendingQueue.forEach((p) => p.reject(new Error('Session expired')));
      pendingQueue = [];
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;
