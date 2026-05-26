import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost'}/api`;

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,         // send cookie automatically on every request
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ── 401 interceptor: auto-refresh then retry ─────────────────────────────────

const AUTH_PUBLIC_PATHS = ['/login', '/register'];

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname ?? '';
  // Skip redirect when already on a public page — prevents reload loops.
  if (AUTH_PUBLIC_PATHS.some(p => path.startsWith(p))) return;
  window.location.href = '/login';
}

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

    // Also bail immediately if the refresh endpoint itself returned 401 —
    // isRefreshing is still true at that point, so queuing it would deadlock.
    if (originalRequest._retry || originalRequest.url === '/auth/refresh') {
      redirectToLogin();
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
      await http.post('/auth/refresh');

      pendingQueue.forEach((p) => p.resolve(undefined));
      pendingQueue = [];

      return http({ ...originalRequest, _retry: true });
    } catch {
      pendingQueue.forEach((p) => p.reject(new Error('Session expired')));
      pendingQueue = [];
      redirectToLogin();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;
