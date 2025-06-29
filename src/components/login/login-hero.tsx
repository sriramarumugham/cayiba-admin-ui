// src/components/login/LoginHero.tsx
export function LoginHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl opacity-90 mb-8">
            Sign in to access your dashboard and manage your account
          </p>
          <div className="w-32 h-32 mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-4 opacity-60">
            <div className="h-2 bg-white/30 rounded"></div>
            <div className="h-2 bg-white/50 rounded"></div>
            <div className="h-2 bg-white/30 rounded"></div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
    </div>
  );
}
