import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FileText,
  TrendingUp,
  Heart,
  Clock3,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Users,
  Star,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors = {};

    // -------------------------------
    // NAME
    // -------------------------------

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // -------------------------------
    // EMAIL
    // -------------------------------

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // -------------------------------
    // PASSWORD
    // -------------------------------

    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Use 8+ characters with uppercase, lowercase, number and special character";
    }

    // -------------------------------
    // CONFIRM PASSWORD
    // -------------------------------

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setGeneralError("");

    const validationErrors = validate();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // GET EXISTING USERS
      // =================================================

      let users = JSON.parse(
        localStorage.getItem("notesKeeperUsers") || "[]"
      );

      if (!Array.isArray(users)) {
        users = [];
      }

      // =================================================
      // OLD USER STORAGE SUPPORT
      // =================================================

      const oldUser = JSON.parse(
        localStorage.getItem("notesKeeperUser") || "null"
      );

      if (users.length === 0 && oldUser) {
        users = [oldUser];
      }

      // =================================================
      // CHECK DUPLICATE EMAIL
      // =================================================

      const emailExists = users.some(
        (user) =>
          user.email?.toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (emailExists) {
        setLoading(false);

        setGeneralError(
          "An account with this email already exists."
        );

        return;
      }

      // =================================================
      // CREATE USER
      // =================================================

      const user = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "user",
      };

      // =================================================
      // SAVE USER
      // =================================================

      users.push(user);

      localStorage.setItem(
        "notesKeeperUsers",
        JSON.stringify(users)
      );

      // Keep old storage working
      localStorage.setItem(
        "notesKeeperUser",
        JSON.stringify(user)
      );

      // User must login after registration
      localStorage.removeItem("notesKeeperLoggedIn");
      localStorage.removeItem("notesKeeperCurrentUser");

      setLoading(false);

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setLoading(false);

      setGeneralError(
        "Something went wrong. Please try again."
      );
    }
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setGeneralError("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f5ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1450px] overflow-hidden rounded-[30px] border border-violet-100 bg-white shadow-2xl shadow-purple-200/40 lg:grid-cols-[1.08fr_0.92fr]">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#fbf7ff] via-[#f4edff] to-[#fceeff] lg:flex">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

          <div className="absolute right-[-100px] top-[-60px] h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col px-10 py-9 xl:px-14">

            {/* LOGO */}

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-300/50">
                <FileText size={25} />
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#11143d]">
                Notes{" "}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Keeper
                </span>
              </h1>
            </div>

            {/* MAIN TEXT */}

            <div className="mt-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-violet-600">
                Keep your ideas organized
              </p>

              <h2 className="mt-4 text-[48px] font-black leading-[0.98] tracking-tight text-[#11143d] xl:text-[56px]">
                Your thoughts.
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Your ideas.
                </span>
                <span className="block">
                  Your space.
                </span>
              </h2>

              <p className="mt-5 max-w-[490px] text-[14px] leading-6 text-slate-600">
                Notes Keeper helps you capture, organize and
                manage your notes in a simple, beautiful and
                productive way.
              </p>
            </div>

            {/* GIRL IMAGE AREA */}

            <div className="relative mt-3 flex min-h-[320px] flex-1 items-center justify-center">

              <div className="absolute h-[310px] w-[430px] rounded-full bg-violet-300/40 blur-3xl" />

              {/* Left heart */}

              <Heart
                size={28}
                fill="currentColor"
                className="absolute left-[10%] top-[25%] z-20 text-pink-400"
              />

              {/* Right heart */}

              <Heart
                size={21}
                fill="currentColor"
                className="absolute right-[10%] top-[42%] z-20 text-pink-400"
              />

              {/* Sparkle */}

              <Sparkles
                size={25}
                className="absolute left-[22%] top-[8%] z-20 text-yellow-400"
              />

              {/* Clock */}

              <div className="absolute right-[15%] top-[4%] z-30 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-xl shadow-violet-300">
                <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-white">
                  <Clock3
                    size={29}
                    className="text-violet-600"
                  />
                </div>
              </div>

              {/* GIRL IMAGE */}

              <div className="relative z-10 overflow-hidden rounded-[30px] border-[8px] border-white bg-white shadow-2xl shadow-violet-300/60">
                <img
                  src="/dashboard-girl.png"
                  alt="Notes Keeper girl using laptop"
                  className="h-[300px] w-[305px] object-cover object-center"
                />
              </div>

              {/* FLOATING NOTE */}

              <div className="absolute bottom-[5%] left-[10%] z-30 rotate-[-6deg] rounded-2xl bg-yellow-100 px-5 py-4 text-center shadow-xl">
                <p className="text-[11px] font-bold leading-5 text-[#27145f]">
                  Small
                  <br />
                  Notes
                  <br />
                  Big Dreams
                </p>

                <Heart
                  size={12}
                  fill="currentColor"
                  className="mx-auto mt-1 text-pink-500"
                />
              </div>

              {/* SMART NOTES CARD */}

              <div className="absolute bottom-[4%] right-[6%] z-30 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
                    <FileText
                      size={17}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-[#11143d]">
                      Smart Notes
                    </p>

                    <p className="text-[9px] text-slate-500">
                      Stay organized
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURES */}

            <div className="grid grid-cols-3 gap-3">

              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <FileText
                    size={19}
                    className="text-yellow-500"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black text-[#11143d]">
                    Organize your notes
                  </p>

                  <p className="text-[9px] text-slate-500">
                    Keep everything in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                  <TrendingUp
                    size={19}
                    className="text-pink-500"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black text-[#11143d]">
                    Stay productive
                  </p>

                  <p className="text-[9px] text-slate-500">
                    Turn ideas into action.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Heart
                    size={19}
                    className="text-emerald-500"
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black text-[#11143d]">
                    Capture every idea
                  </p>

                  <p className="text-[9px] text-slate-500">
                    From daily tasks to big dreams.
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white bg-white/75 px-6 py-3 shadow-sm backdrop-blur">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
                  <Users
                    size={17}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-[#11143d]">
                    1K+
                  </p>

                  <p className="text-[8px] text-slate-500">
                    Happy Users
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-violet-200" />

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                  <FileText
                    size={17}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-[#11143d]">
                    10K+
                  </p>

                  <p className="text-[8px] text-slate-500">
                    Notes Created
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-violet-200" />

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100">
                  <Star
                    size={17}
                    className="text-pink-500"
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-[#11143d]">
                    98%
                  </p>

                  <p className="text-[8px] text-slate-500">
                    Positive Feedback
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            RIGHT REGISTER SECTION
        ================================================= */}

        <section className="relative flex items-center justify-center bg-white px-5 py-7 sm:px-10">

          <div className="absolute right-[-60px] top-[-60px] h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="absolute bottom-[-80px] left-[-50px] h-60 w-60 rounded-full bg-fuchsia-100/40 blur-3xl" />

          <div className="relative z-10 w-full max-w-[500px]">

            {/* MOBILE LOGO */}

            <div className="mb-6 text-center lg:hidden">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg">
                <FileText size={24} />
              </div>

              <h1 className="text-2xl font-black text-[#11143d]">
                Notes{" "}
                <span className="text-violet-600">
                  Keeper
                </span>
              </h1>
            </div>

            {/* REGISTER CARD */}

            <div className="rounded-[28px] border border-violet-100 bg-white p-7 shadow-2xl shadow-purple-100 sm:p-8">

              {/* Card logo */}

              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                  <FileText size={24} />
                </div>

                <h2 className="text-2xl font-black text-[#11143d]">
                  Notes{" "}
                  <span className="text-violet-600">
                    Keeper
                  </span>
                </h2>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-violet-500">
                  Keep your ideas organized
                </p>
              </div>

              {/* Heading */}

              <div className="mb-5">
                <h3 className="text-2xl font-black text-[#11143d]">
                  Create your account
                </h3>

                <p className="mt-1.5 text-sm text-slate-500">
                  Join Notes Keeper and start organizing your ideas.
                </p>
              </div>

              {/* General Error */}

              {generalError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {generalError}
                  </p>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3.5"
              >

                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-[#11143d]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={`h-12 w-full rounded-xl border bg-violet-50/40 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        errors.name
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-violet-100 focus:border-violet-500 focus:ring-violet-100"
                      }`}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-[#11143d]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`h-12 w-full rounded-xl border bg-violet-50/40 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-violet-100 focus:border-violet-500 focus:ring-violet-100"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-semibold text-[#11143d]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className={`h-12 w-full rounded-xl border bg-violet-50/40 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-violet-100 focus:border-violet-500 focus:ring-violet-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 transition hover:text-violet-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs leading-4 text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-semibold text-[#11143d]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError("confirmPassword");
                      }}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className={`h-12 w-full rounded-xl border bg-violet-50/40 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        errors.confirmPassword
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-violet-100 focus:border-violet-500 focus:ring-violet-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 transition hover:text-violet-600"
                    >
                      {showConfirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  disabled={loading}
                  className={`group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg shadow-violet-200 transition ${
                    loading
                      ? "cursor-not-allowed bg-violet-400"
                      : "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {loading
                    ? "Creating account..."
                    : "Create Account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* LOGIN LINK */}

              <div className="mt-6 border-t border-violet-100 pt-5 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-violet-600 transition hover:text-fuchsia-600"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            {/* FOOTER */}

            <p className="mt-4 text-center text-xs text-slate-400">
              © 2026 Notes Keeper. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;