"use client";

import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "customer" | "admin";

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    name: string;
    email: string;
    role: string;
    profile?: string;
  };
};

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint =
        role === "admin" ? "/auth/admin/login" : "/auth/user/login";

      const response = await AxiosInstance.post<LoginResponse>(
        endpoint,
        formData,
      );

      if (response.data.success) {
        router.push(role === "admin" ? "/admin/dashboard" : "/");

        router.refresh();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

          <p className="mt-2 text-sm text-gray-500">Login to your account</p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role */}

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">Login as</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Customer */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  role === "customer"
                    ? "border-black bg-gray-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">Customer</span>
              </label>

              {/* Admin */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  role === "admin"
                    ? "border-black bg-gray-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">Admin</span>
              </label>
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-black hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
