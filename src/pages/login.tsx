// src/pages/login.tsx
import { useAuth } from "@/store/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useLogin } from "@/api/mutations";
import { toast } from "sonner";
import { LoginHero } from "@/components/login/login-hero";
import { LoginContainer } from "@/components/login/login-container";
import { LoginForm } from "@/components/login/logoin-form";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { setAuth, isAuthenticated } = useAuth();
  const location = useLocation();

  // Use your custom login mutation
  const loginMutation = useLogin();

  // If already authenticated, redirect
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        // Extract data from the API response structure
        const { data } = response;
        const user = {
          id: data.id,
          email: data.email,
          fullName: data.fullName,
        };
        setAuth(user, data.token);

        toast.success("Welcome back! Redirecting to your dashboard...");

        // Small delay to show the success toast
        setTimeout(() => {
          const from = location.state?.from?.pathname || "/dashboard";
          window.location.href = from;
        }, 1000);
      },
      onError: (error: any) => {
        // Handle different types of errors based on your API structure
        let errorMessage = "Login failed. Please try again.";

        if (error?.response?.status === 401) {
          errorMessage =
            error?.response?.data?.message ||
            "Invalid email or password. Please check your credentials.";
        } else if (error?.response?.status === 400) {
          errorMessage =
            error?.response?.data?.message ||
            "Invalid request. Please check your input.";
        } else if (error?.response?.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
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
    <div className="min-h-screen flex">
      <LoginHero />
      <LoginContainer>
        <LoginForm onSubmit={handleLogin} isLoading={loginMutation.isPending} />
      </LoginContainer>
    </div>
  );
}
