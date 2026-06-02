import axios, { type AxiosError } from 'axios';


const axiosInterceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData uploads, let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

axiosInterceptor.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const body = error.response?.data;
    const message = body?.error ?? body?.message ?? error.message ?? 'Request failed';
    return Promise.reject(new ApiError(message, error.response?.status, body));
  }
);

export default axiosInterceptor;
