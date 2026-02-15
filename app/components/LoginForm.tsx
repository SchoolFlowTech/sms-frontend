"use client";

import React, { useEffect, useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
    if (!endpoint) {
      throw new Error("GraphQL URL is not configured");
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ REQUIRED
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { email, password },
      }),
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      throw new Error(
        json?.errors?.[0]?.message || "Login failed. Please try again."
      );
    }

    // ❌ DO NOT read or set cookies here
    toast.success("User Logged In successfully! 🎉");

    // ✅ Just redirect
    router.replace("/dashboard");

  } catch (err: any) {
    setError(err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.replace("/dashboard");
  //   }
  // }, [router]);
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Welcome Back!
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Sign in to your account to continue.
      </p>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-base border border-gray-100 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-base border border-gray-100 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 text-center font-medium">{error}</p>
      )}

      {/* Forgot Password */}
      <div className="flex justify-between items-center">
        <div />
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-3 bg-primary text-white rounded-xl text-lg font-bold shadow-xl shadow-primary/30 transform transition-all duration-300 hover:bg-primary/90 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
      >
        <LogIn className="w-5 h-5 mr-2" />
        {loading ? "Logging in..." : "Login to Account"}
      </button>

      {/* OR Divider */}
      <div className="flex items-center space-x-2">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center py-3 bg-white text-gray-700 rounded-xl text-lg font-bold border border-gray-200 transition-all duration-300 hover:bg-gray-50"
      >
        <img
          src="/google.png"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </button>
    </form>
  );
}
