"use client";

import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignUpForm";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF1FF] via-[#F5F7FF] to-[#FDFBFF] px-4">
      {/* Outer wrapper to control max width */}
      <div className="w-full max-w-5xl h-[calc(100vh-80px)] flex items-center">
        {/* Glassmorphism card */}
        <div className="rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_24px_80px_rgba(15,23,42,0.18)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 w-full h-full">
          
          {/* LEFT: Image + overlay stats */}
          <div className="relative hidden lg:block h-full">
            <img
              src="/2b50111f-f587-4a95-b7ea-3a14ebd8b794.jpeg"
              alt="School campus"
              className="h-full w-full object-cover"
            />

            {/* Gradient overlay bottom to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Branding + tagline */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white/90">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/15 text-black flex items-center justify-center text-base font-bold">
                  SF
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-black">SchoolFlow</p>
                  <p className="text-xs text-black/70">Smart School Management</p>
                </div>
              </div>
              <span className="hidden md:inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium">
                v1.0 • Early Access
              </span>
            </div>

            {/* Bottom stats chips */}
            <div className="sticky bottom-6 left-6 right-6 max-w-[90%] grid grid-cols-2 gap-3 text-white">
              <div className="rounded-2xl bg-white/12 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-white/70">Active Students</p>
                <p className="text-xl font-semibold leading-snug">892</p>
                <p className="text-[11px] text-emerald-300 mt-1">+12.5% vs last term</p>
              </div>
              <div className="rounded-2xl bg-white/12 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-white/70">On-time Attendance</p>
                <p className="text-xl font-semibold leading-snug">96%</p>
                <p className="text-[11px] text-emerald-300 mt-1">Stable this week</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Auth content */}
          <div className="p-3 lg:p-5 flex flex-col ">
            {/* Brand on mobile */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  SF
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">SchoolFlow</p>
                  <p className="text-xs text-slate-500">Smart School Management</p>
                </div>
              </div>
            </div>

            {/* Toggle buttons */}
            <div className="flex w-full max-w-sm mx-auto p-1 rounded-full bg-slate-100/70 border border-slate-200/80 mb-6">
              <button
                onClick={() => setIsLoginView(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isLoginView
                    ? "bg-primary text-white shadow-md shadow-primary/40"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                <LogIn className="w-3 h-3" />
                Login
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  !isLoginView
                    ? "bg-primary text-white shadow-md shadow-primary/40"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                <UserPlus className="w-3 h-3" />
                Sign Up
              </button>
            </div>

            {/* Forms */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md">
                {isLoginView ? <LoginForm /> : <SignupForm />}
              </div>
            </div>

            {/* Footer text */}
            <p className="mt-4 text-[11px] text-center text-slate-400">
              By continuing, you agree to SchoolFlow&apos;s{" "}
              <span className="font-medium text-slate-500 hover:text-primary cursor-pointer">
                Terms
              </span>{" "}
              and{" "}
              <span className="font-medium text-slate-500 hover:text-primary cursor-pointer">
                Privacy Policy
              </span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
