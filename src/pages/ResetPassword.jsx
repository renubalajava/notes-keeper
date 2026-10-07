import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors = {};

    // Password validation
    if (!password) {
      newErrors.password = "New password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Use 8+ characters with uppercase, lowercase, number and special character";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // =================================================
      // GET RESET EMAIL
      // =================================================

      const resetEmail = localStorage.getItem("resetEmail");

      if (!resetEmail) {
        setErrors({
          general:
            "Password reset session expired. Please try again.",
        });
        return;
      }

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
      // FIND USER
      // =================================================

      const userIndex = users.findIndex(
        (existingUser) =>
          existingUser.email?.toLowerCase() ===
          resetEmail.toLowerCase()
      );

      if (userIndex === -1) {
        setErrors({
          general:
            "User account not found. Please try again.",
        });
        return;
      }

      // =================================================
      // UPDATE PASSWORD
      // =================================================

      const updatedUser = {
        ...users[userIndex],
        password: password,
      };

      users[userIndex] = updatedUser;

      // =================================================
      // SAVE USERS
      // =================================================

      localStorage.setItem(
        "notesKeeperUsers",
        JSON.stringify(users)
      );

      // =================================================
      // KEEP OLD STORAGE UPDATED
      // =================================================

      localStorage.setItem(
        "notesKeeperUser",
        JSON.stringify(updatedUser)
      );

      // =================================================
      // REMOVE RESET SESSION
      // =================================================

      localStorage.removeItem("resetEmail");

      // =================================================
      // SUCCESS
      // =================================================

      alert("Password reset successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);

      setErrors({
        general:
          "Something went wrong. Please try again.",
      });
    }
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
      general: "",
    }));
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
            RESET CARD
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7">

            <h2 className="text-2xl font-semibold text-gray-900">
              Reset your password
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Create a new password for your Notes Keeper
              account.
            </p>

          </div>

          {/* =================================================
              GENERAL ERROR
          ================================================= */}

          {errors.general && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm text-red-600">
                {errors.general}
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
                NEW PASSWORD
            ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  className={`w-full h-12 px-4 pr-16 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs leading-5 text-red-500">
                  {errors.password}
                </p>
              )}

            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm new password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  className={`w-full h-12 px-4 pr-16 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-700"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}

            </div>

            {/* =================================================
                PASSWORD REQUIREMENTS
            ================================================= */}

            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">

              <p className="text-xs font-medium text-gray-700 mb-2">
                Password must contain:
              </p>

              <ul className="text-xs text-gray-500 space-y-1">

                <li>• At least 8 characters</li>

                <li>
                  • Uppercase and lowercase letters
                </li>

                <li>• At least one number</li>

                <li>
                  • At least one special character
                </li>

              </ul>

            </div>

            {/* =================================================
                RESET BUTTON
            ================================================= */}

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            >
              Reset Password
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

export default ResetPassword;