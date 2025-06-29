// src/pages/create-sub-admin.tsx
import { useNavigate } from "react-router-dom";
import { useCreateSubAdmin } from "@/api/mutations";
import { toast } from "sonner";
import { CreateSubAdminContainer } from "@/components/admin/sub-admin-container";
import { CreateSubAdminForm } from "@/components/admin/create-subadmin-form";
import { ROUTES } from "@/router";

type CreateSubAdminFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  password: string;
  confirmPassword: string;
};

export default function CreateSubAdminPage() {
  const navigate = useNavigate();

  const createSubAdminMutation = useCreateSubAdmin();

  const handleCreateSubAdmin = (data: CreateSubAdminFormData) => {
    const { confirmPassword, ...submitData } = data;

    createSubAdminMutation.mutate(submitData, {
      onSuccess: (response) => {
        // Extract data from the API response structure
        const { data } = response;

        toast.success(`Sub-admin ${data.fullName} created successfully!`);

        setTimeout(() => {
          navigate(ROUTES.ADMIN);
        }, 1000);
      },
      onError: (error: any) => {
        //! TODO common error message handler
        let errorMessage = "Failed to create sub-admin. Please try again.";

        if (error?.response?.status === 400) {
          errorMessage =
            error?.response?.data?.message ||
            "Invalid request. Please check your input.";
        } else if (error?.response?.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error?.response?.status === 403) {
          errorMessage = "You don't have permission to create sub-admins.";
        } else if (error?.response?.status === 422) {
          errorMessage =
            error?.response?.data?.message ||
            "Validation error. Please check your input.";
        } else if (error?.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateSubAdminContainer>
        <CreateSubAdminForm
          onSubmit={handleCreateSubAdmin}
          isLoading={createSubAdminMutation.isPending}
        />
      </CreateSubAdminContainer>
    </div>
  );
}
