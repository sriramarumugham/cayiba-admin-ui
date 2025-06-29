import { useAuth } from "@/store/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const { token } = useAuth.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login if:
    // 1. The response status is 401
    // 2. User is NOT already on the login page
    // 3. It's not a login request that failed
    if (
      err.response?.status === 401 &&
      !window.location.pathname.includes("/login") &&
      !err.config?.url?.includes("/login") // Don't redirect if this was a login API call
    ) {
      // Clear any stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login with the current location
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(err);
  },
);

export interface PaginationMeta {
  totalDocs: number;
  pageSize: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface BaseResponse<T> {
  status: string;
  message: string;
  timestamp: string;
  data: T;
}

export interface ErrorResponse {
  status: string;
  message: string;
  timestamp: string;
  errorSource: string;
  errors: string;
}
export type PaginatedResponse<T> = BaseResponse<PaginationMeta & { docs: T[] }>;

export interface TableResponse<T> extends PaginationMeta {
  data: T[];
}

export const transformApiResponse = <T>(
  apiResponse: PaginatedResponse<T>,
): TableResponse<T> => {
  const { data } = apiResponse;
  return {
    data: data.docs,
    ...data,
  };
};
