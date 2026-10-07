import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    // ===================================================
    // REQUIRED VALIDATION
    // ===================================================

    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }

    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // =================================================
      // GET USERS
      // =================================================

      let users = JSON.parse(
        localStorage.getItem("notesKeeperUsers") || "[]"
      );

      if (!Array.isArray(users)) {
        users = [];
      }

      // =================================================
      // SUPPORT OLD USER STORAGE
      // =================================================

      const oldUser = JSON.parse(
        localStorage.getItem("notesKeeperUser") || "null"
      );

      if (users.length === 0 && oldUser) {
        users = [oldUser];
      }

      // =================================================
      // FIND REGISTERED USER
      // =================================================

      const user = users.find(
        (existingUser) =>
          existingUser.email?.toLowerCase() ===
          trimmedEmail.toLowerCase()
      );

      if (!user) {
        setError("No account found with this email address");
        return;
      }

      // =================================================
      // SAVE EMAIL FOR RESET PASSWORD
      // =================================================

      localStorage.setItem("resetEmail", trimmedEmail);

      // =================================================
      // GO TO RESET PASSWORD
      // =================================================

      navigate("/reset-password");
    } catch (error) {
      console.error("Forgot password error:", error);

      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f6fb] flex items-center justify-center px-4 py-8">

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="w-full max-w-md">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="text-center mb-7">

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white shadow-sm mb-4">

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />

              <path d="M8 7h7" />

              <path d="M8 11h7" />

              <path d="M8 15h5" />
            </svg>

          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Notes Keeper
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Keep your ideas organized
          </p>

        </div>

        {/* =================================================
            CARD
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7">

            <h2 className="text-2xl font-semibold text-gray-900">
              Forgot your password?
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Enter your registered email address to
              continue resetting your password.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

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

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>

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
                className={`w-full h-12 px-4 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none transition ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                }`}
              />

            </div>

            {/* =================================================
                CONTINUE
            ================================================= */}

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            >
              Continue
            </button>

          </form>

          {/* =================================================
              BACK TO LOGIN
          ================================================= */}

          <div className="mt-7 pt-6 border-t border-gray-100 text-center">

            <p className="text-sm text-gray-500">

              Remember your password?{" "}

              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Notes Keeper. All rights reserved.
        </p>

      </div>

    </main>
  );
}

export default ForgotPassword;