import { useQuery } from "@tanstack/react-query";
import {
  api,
  transformApiResponse,
  type BaseResponse,
  type PaginatedResponse,
} from "./api";
import type {
  TableQueryParams,
  TableResponse,
} from "@/components/custom/table";
import type { ErrorResponse } from "react-router-dom";
import { AUTH_ENDPOINTS } from "./endpoints";

export interface SubAdmin {
  adminId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  role: "ADMIN";
  createdBy: string;
  referralCode: string;
}

export const fetchSubAdmins = async (
  params: TableQueryParams,
): Promise<TableResponse<SubAdmin>> => {
  const res = await api.get<PaginatedResponse<SubAdmin>>(
    "/cayiba/api/v1/admin/sub-admin",
    { params },
  );
  return transformApiResponse<SubAdmin>(res.data);
};

export enum E_STATUS {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  BLOCKED = "BLOCKED",
}

export enum E_INVENTORY_STATUS {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  UNLIST = "UNLIST",
}

export interface Advertisement {
  advertismentId: string;
  productName: string;
  productDescription: string;
  views: number;
  categoryName: string;
  categoryId: string;
  price: string;
  subcategoryName: string;
  subcategoryId: string;
  images: string[];
  city: string;
  zip: string;
  address: string;
  createdBy: string;
  status: E_STATUS;
  inventoryDetails: E_INVENTORY_STATUS;
  productDetails: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchAdvertisements = async (
  params: TableQueryParams & { status?: string },
): Promise<TableResponse<Advertisement>> => {
  const queryParams = {
    ...params,
    sortOrder: params.sortOrder || "desc",
    status: params.status || "ACTIVE",
  };

  const res = await api.get<PaginatedResponse<Advertisement>>(
    "/cayiba/api/v1/advertisment/admin/advertisments",
    { params: queryParams },
  );

  return transformApiResponse<Advertisement>(res.data);
};

export interface UploadedBy {
  uploadedBy: {
    fullName?: string;
    phoneNumber?: string;
    countryCode?: string;
    email?: string;
  };
}

type AdvertisementDetailsType = Advertisement & UploadedBy;

export const useGetAdvertisement = (id: string) => {
  return useQuery<BaseResponse<AdvertisementDetailsType>, ErrorResponse>({
    queryKey: ["advertisement", id],
    queryFn: async (): Promise<BaseResponse<AdvertisementDetailsType>> => {
      const res = await api.get<BaseResponse<AdvertisementDetailsType>>(
        `${AUTH_ENDPOINTS.SEARCH}/${id}`,
      );
      console.log("Get Advertisement Response:", res.data);
      return res.data;
    },
    enabled: !!id,
  });
};

// Dashboard APIs
export interface DashboardStats {
  totalAdvertisements: number;
  activeAdvertisements: number;
  deletedAdvertisements: number;
  blockedAdvertisements: number;
  availableInventory: number;
  soldInventory: number;
  unlistedInventory: number;
}

export interface GraphDataPoint {
  date: string;
  count: number;
}

export interface DashboardGraphData {
  data: GraphDataPoint[];
}

export const fetchDashboardStats = async (): Promise<
  BaseResponse<DashboardStats>
> => {
  const res = await api.get<BaseResponse<DashboardStats>>(
    "/cayiba/api/v1/admin/dashboard/stats",
  );
  return res.data;
};

export const fetchDashboardGraph = async (
  period: "7d" | "30d" | "90d" | "1y" = "30d",
): Promise<BaseResponse<DashboardGraphData>> => {
  const res = await api.get<BaseResponse<DashboardGraphData>>(
    `/cayiba/api/v1/admin/dashboard/graph?period=${period}`,
  );
  return res.data;
};

export const useDashboardStats = () => {
  return useQuery<BaseResponse<DashboardStats>, ErrorResponse>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
};

export const useDashboardGraph = (
  period: "7d" | "30d" | "90d" | "1y" = "30d",
) => {
  return useQuery<BaseResponse<DashboardGraphData>, ErrorResponse>({
    queryKey: ["dashboard-graph", period],
    queryFn: () => fetchDashboardGraph(period),
  });
};
