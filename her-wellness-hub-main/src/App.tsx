import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import HealthProfile from "./pages/HealthProfile";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import DietPlan from "./pages/DietPlan";
import PeriodTracker from "./pages/PeriodTracker";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const queryClient = new QueryClient();

// 🔒 Protected Route (ONLY THIS USE)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  const token = localStorage.getItem("token");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* 🌐 PUBLIC */}
            <Route path="/" element={<Landing />} />

            {/* 🔥 NO PublicRoute */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* OTP FLOW */}
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/set-password" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🔒 PROTECTED */}
            <Route
              path="/health-profile"
              element={
                <ProtectedRoute>
                  <HealthProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />

            <Route
              path="/diet-plan"
              element={
                <ProtectedRoute>
                  <DietPlan />
                </ProtectedRoute>
              }
            />

            <Route
              path="/period-tracker"
              element={
                <ProtectedRoute>
                  <PeriodTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ❌ NOT FOUND */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;