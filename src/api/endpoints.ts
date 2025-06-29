export const API_BASE = "/cayiba/api/v1";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  ADMIN_LOGIN: `${API_BASE}/auth/admin/login`,
  CREATE_SUB_ADMIN: `${API_BASE}/admin/sub-admin`,
  SEARCH: `${API_BASE}/search`,
  BLOCK: `${API_BASE}/advertisment/admin/block`,
} as const;
