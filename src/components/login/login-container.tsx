// src/components/login/LoginContainer.tsx
interface LoginContainerProps {
  children: React.ReactNode;
}

export function LoginContainer({ children }: LoginContainerProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
