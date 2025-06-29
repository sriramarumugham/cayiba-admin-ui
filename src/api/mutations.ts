import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type BaseResponse } from "./api";
import { AUTH_ENDPOINTS } from "./endpoints";
import type { ErrorResponse } from "react-router-dom";

// Request types
interface LoginData {
  email: string;
  password: string;
}

// Response types based on your API documentation
type LoginSuccessResponse = BaseResponse<{
  token: string;
  email: string;
  fullName: string;
  id: string;
}>;

export const useLogin = () => {
  return useMutation<LoginSuccessResponse, ErrorResponse, LoginData>({
    mutationFn: async (data: LoginData): Promise<LoginSuccessResponse> => {
      const res = await api.post<LoginSuccessResponse>(
        AUTH_ENDPOINTS.ADMIN_LOGIN,
        data,
      );

      console.log("Login Response:", res.data);
      return res.data;
    },
  });
};

interface CreateSubAdminData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  password: string;
}

type CreateSubAdminSuccessResponse = BaseResponse<{
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  createdAt: string;
}>;

export const useCreateSubAdmin = () => {
  return useMutation<
    CreateSubAdminSuccessResponse,
    ErrorResponse,
    CreateSubAdminData
  >({
    mutationFn: async (
      data: CreateSubAdminData,
    ): Promise<CreateSubAdminSuccessResponse> => {
      const res = await api.post<CreateSubAdminSuccessResponse>(
        AUTH_ENDPOINTS.CREATE_SUB_ADMIN, // Add this to your endpoints: CREATE_SUB_ADMIN: "/admin/sub-admin"
        data,
      );

      console.log("Create Sub-Admin Response:", res.data);
      return res.data;
    },
  });
};

export const useBlockAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<any>, ErrorResponse, string>({
    mutationFn: async (id: string): Promise<BaseResponse<any>> => {
      const res = await api.post<BaseResponse<any>>(
        `${AUTH_ENDPOINTS.BLOCK}/${id}`,
        {},
      );
      console.log("Block Advertisement Response:", res.data);
      return res.data;
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["advertisement", variables] });
    },
  });
};
