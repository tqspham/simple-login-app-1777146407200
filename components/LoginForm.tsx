"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        setPassword("");
        router.push("/dashboard");
      } else {
        setErrors({ general: data.message });
        setPassword("");
      }
    } catch {n      setErrors({ general: "An error occurred. Please try again." });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={twMerge(
            "mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          )}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className={twMerge(
            "mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          )}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={twMerge(
          "flex w-full items-center justify-center rounded-md px-4 py-2 font-medium text-white transition-colors",
          isLoading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          "Login"
        )}
      </button>

      {isLoading && (
        <p className="text-center text-sm text-gray-600">Please wait...</p>
      )}
    </form>
  );
}
