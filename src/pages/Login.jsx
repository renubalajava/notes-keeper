import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FileText,
  Sparkles,
  Heart,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const ADMIN_EMAIL = "admin@noteskeeper.com";
  const ADMIN_PASSWORD = "Admin@123";

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter your email and password.");

      return;
    }

    // Correct email validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // ===================================================
    // ADMIN LOGIN
    // ===================================================

    if (
      trimmedEmail === ADMIN_EMAIL &&
      trimmedPassword === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: "admin",
        name: "Notes Keeper Admin",
        email: ADMIN_EMAIL,
        role: "admin",
      };

      localStorage.setItem(
        "notesKeeperCurrentUser",
        JSON.stringify(adminUser)
      );

      localStorage.setItem(
        "notesKeeperLoggedIn",
        "true"
      );

      setTimeout(() => {
        navigate("/admin");
      }, 400);

      return;
    }

    // ===================================================
    // NORMAL USER LOGIN
    // ===================================================

    try {
      let users = JSON.parse(
        localStorage.getItem("notesKeeperUsers") || "[]"
      );

      if (!Array.isArray(users)) {
        users = [];
      }

      // Legacy user support
      const legacyUser = JSON.parse(
        localStorage.getItem("notesKeeperUser") || "null"
      );

      if (
        legacyUser &&
        !users.some(
          (user) =>
            user.email?.toLowerCase() ===
            legacyUser.email?.toLowerCase()
        )
      ) {
        users.push(legacyUser);
      }

      // Find user
      const loggedInUser = users.find(
        (user) =>
          user.email?.toLowerCase() === trimmedEmail &&
          user.password === trimmedPassword
      );

      if (!loggedInUser) {
        setLoading(false);
        setError("Invalid email or password.");
        return;
      }

      const currentUser = {
        ...loggedInUser,
        role: loggedInUser.role || "user",
      };

      localStorage.setItem(
        "notesKeeperCurrentUser",
        JSON.stringify(currentUser)
      );

      localStorage.setItem(
        "notesKeeperLoggedIn",
        "true"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 400);
    } catch (err) {
      console.error("Login error:", err);

      setLoading(false);
      setError(
        "Something went wrong. Please try again."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f5ff] px-4 py-5 sm:px-6 lg:px-8">

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-violet-100 bg-white shadow-2xl shadow-purple-200/40">

        {/* =====================================================
            TOP CENTER HEADING
        ===================================================== */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#faf6ff] via-[#f5edff] to-[#fcefff] px-6 pb-6 pt-6 text-center sm:px-10 lg:px-16">

          {/* Background Glow */}

          <div className="absolute -left-24 -top-24 h-60 w-60 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="absolute -right-24 -top-20 h-60 w-60 rounded-full bg-fuchsia-200/30 blur-3xl" />

          {/* Brand */}

          <div className="relative z-10 mb-3 flex items-center justify-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md">
              <FileText size={19} />
            </div>

            <h1 className="text-xl font-black tracking-tight text-[#171052] sm:text-2xl">
              Notes{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Keeper
              </span>
            </h1>

          </div>

          {/* Tagline */}

          <p className="relative z-10 text-[9px] font-extrabold uppercase tracking-[0.25em] text-violet-600 sm:text-[10px]">
            Keep your ideas organized
          </p>

          {/* =================================================
              FINAL 2-LINE HEADING
          ================================================= */}

          <h2 className="relative z-10 mx-auto mt-2 text-[30px] font-black leading-[1.08] tracking-tight text-[#171052] sm:text-[34px] lg:text-[38px]">

            <span className="block">
              Your thoughts.
            </span>

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Your ideas.
            </span>

          </h2>

          {/* Description */}

          <p className="relative z-10 mx-auto mt-2 max-w-lg text-[11px] leading-5 text-slate-600 sm:text-xs">
            Notes Keeper helps you capture, organize and manage your notes
            in a simple, beautiful and productive way.
          </p>

        </div>

        {/* =====================================================
            TWO EQUAL COLUMNS
        ===================================================== */}

        <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-2">

          {/* ===================================================
              LEFT — GIRL IMAGE
          =================================================== */}

          <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#faf6ff] via-[#f5edff] to-[#fcefff] lg:min-h-[600px]">

            {/* Glow */}

            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

            <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

            <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/25 blur-[90px]" />

            {/* Sparkle */}

            <Sparkles
              size={26}
              className="absolute left-[12%] top-[25%] z-20 text-violet-400"
            />

            {/* Heart */}

            <Heart
              size={24}
              fill="currentColor"
              className="absolute right-[13%] top-[34%] z-20 text-pink-400"
            />

            {/* Decorative Dots */}

            <div className="absolute bottom-[22%] left-[16%] h-3 w-3 rounded-full bg-violet-400/60" />

            <div className="absolute bottom-[27%] right-[18%] h-4 w-4 rounded-full bg-fuchsia-400/50" />

            {/* Girl Image */}

            <img
              src="public/login-girl.jpg"
              alt="Notes Keeper Login"
              className="relative z-10 h-[450px] w-[78%] object-contain object-center drop-shadow-[0_25px_40px_rgba(76,29,149,0.20)] sm:h-[500px] sm:w-[72%] lg:h-[500px] lg:w-[75%] xl:h-[530px]"
            />

          </section>

          {/* ===================================================
              RIGHT — LOGIN
          =================================================== */}

          <section className="relative flex items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-12">

            {/* Glow */}

            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-100/40 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-fuchsia-100/30 blur-3xl" />

            <div className="relative z-10 w-full max-w-md">

              {/* LOGIN CARD */}

              <div className="rounded-[26px] border border-violet-100 bg-white p-7 shadow-xl shadow-purple-100 sm:p-9">

                {/* Logo */}

                <div className="mb-7 text-center">

                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                    <FileText size={24} />
                  </div>

                  <h3 className="text-2xl font-black text-[#171052]">
                    Notes{" "}
                    <span className="text-violet-600">
                      Keeper
                    </span>
                  </h3>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">
                    Keep your ideas organized
                  </p>

                </div>

                {/* Welcome */}

                <div className="mb-6">

                  <h4 className="text-2xl font-black text-[#171052]">
                    Welcome back
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Sign in to continue to your account.
                  </p>

                </div>

                {/* Error */}

                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Email */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#171052]"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                      />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-violet-100 bg-violet-50/40 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      />

                    </div>

                  </div>

                  {/* Password */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-[#171052]"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                      >
                        Forgot password?
                      </Link>

                    </div>

                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-12 w-full rounded-xl border border-violet-100 bg-violet-50/40 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* Sign In */}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`group flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg shadow-violet-200 transition ${
                      loading
                        ? "cursor-not-allowed bg-violet-400"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-xl"
                    }`}
                  >

                    {loading
                      ? "Signing in..."
                      : "Sign In"}

                    {!loading && (
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}

                  </button>

                </form>

                {/* Register */}

                <div className="mt-7 border-t border-violet-100 pt-6 text-center">

                  <p className="text-sm text-slate-500">

                    Don't have an account?{" "}

                    <Link
                      to="/register"
                      className="font-bold text-violet-600 hover:text-violet-700"
                    >
                      Create an account
                    </Link>

                  </p>

                </div>

                {/* Admin Login */}

                <div className="mt-5 text-center">

                  <button
                    type="button"
                    onClick={() => {
                      setEmail(ADMIN_EMAIL);
                      setPassword(ADMIN_PASSWORD);
                      setError("");
                    }}
                    className="text-xs font-medium text-slate-400 transition hover:text-violet-600"
                  >
                    Admin Login
                  </button>

                </div>

              </div>

              {/* Footer */}

              <p className="mt-5 text-center text-xs text-slate-400">
                © 2026 Notes Keeper. All rights reserved.
              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default Login;