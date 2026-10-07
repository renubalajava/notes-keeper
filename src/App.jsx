import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// COMMON COMPONENTS
// =========================
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChat from "./components/AIChat";

// =========================
// PUBLIC PAGES
// =========================
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// =========================
// USER PAGES
// =========================
import Dashboard from "./pages/Dashboard";
//import AllNotes from "./pages/AllNotes";
import AllNotes from "./pages/AllNotes1";
import Archive from "./pages/Archive";
import Pinned from "./pages/Pinned";
import NotebookView from "./pages/NotebookView";

// =========================
// ADMIN
// =========================
import AdminDashboard from "./pages/AdminDashboard";


// =====================================================
// APP LAYOUT
// Used only for protected User/Admin pages
// =====================================================

function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================== */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Features */}
        <Route
          path="/features"
          element={<Features />}
        />

        {/* How It Works */}
        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* =================================================
            USER PROTECTED ROUTES
        ================================================== */}

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* All Notes */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AllNotes />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Archive */}
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Archive />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Pinned */}
        <Route
          path="/pinned"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Pinned />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Notebook */}
        <Route
          path="/notebook/:notebookName"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NotebookView />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            AI ROUTES
        ================================================== */}

        {/* AI */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AIChat />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AIChat />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ADMIN ROUTE
        ================================================== */}

      <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;