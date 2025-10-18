"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(email);

      // Store in Redux
      dispatch(setCredentials({ token: response.token, email }));

      // Persist to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", email);

      toast.success("Login successful! Welcome back.");
      router.push("/");
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to login. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black via-neutral-900 to-neutral-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-neutral-800 rounded-xl sm:rounded-2xl shadow-2xl border border-neutral-700 p-6 sm:p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-celtic-blue to-pomp-and-power rounded-xl sm:rounded-2xl shadow-lg mb-4">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                background: "linear-gradient(to right, #276FBF, #785589)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome to Prodify
            </h1>
            <p className="text-sm sm:text-base text-neutral-400">
              Sign in to manage your products
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full cursor-pointer"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Info */}
          <div className="pt-4 border-t border-neutral-700">
            <p className="text-xs text-neutral-400 text-center">
              Enter the email you used on your job application to get started
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-neutral-400">
          Need help? Contact us at{" "}
          <a
            href="mailto:connect@bitechx.com"
            className="text-celtic-blue hover:text-pomp-and-power font-medium transition-colors cursor-pointer"
          >
            connect@bitechx.com
          </a>
        </p>
      </div>
    </div>
  );
}
