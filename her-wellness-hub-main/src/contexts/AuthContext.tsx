import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

import { User } from "@/lib/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  sendOtp: (
    email: string
  ) => Promise<void>;

  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<void>;

  register: (
    email: string,
    password: string
  ) => Promise<void>;

  updateProfile: (
    data: Partial<User>
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
};

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // 🔥 LOAD USER
  useEffect(() => {

    const init = async () => {

      try {

        if (api.isAuthenticated()) {

          const profile =
            await api.getProfile();

          console.log(
            "PROFILE LOADED:",
            profile
          );

          // ✅ backend may return { user }
          setUser(profile.user || profile);
        }

      } catch (err) {

        console.log(
          "Auto login failed"
        );

        api.logout();

      } finally {

        setIsLoading(false);
      }
    };

    init();

  }, []);

  // 🔹 LOGIN
  const login = async (
    email: string,
    password: string
  ) => {

    const res =
      await api.login(email, password);

    if (!res.token) {
      throw new Error(
        res.message || "Login failed"
      );
    }

    // ✅ save token
    localStorage.setItem(
      "token",
      res.token
    );

    // ✅ load profile
    const profile =
      await api.getProfile();

    setUser(profile.user || profile);

    localStorage.setItem(
      "user",
      JSON.stringify(
        profile.user || profile
      )
    );
  };

  // 🔹 SEND OTP
  const sendOtp = async (
    email: string
  ) => {

    const res =
      await api.sendOtp(email);

    if (!res.message) {
      throw new Error(
        "OTP send failed"
      );
    }
  };

  // 🔹 VERIFY OTP
  const verifyOtp = async (
    email: string,
    otp: string
  ) => {

    const res =
      await api.verifyOtp(email, otp);

    if (!res.message) {
      throw new Error(
        "OTP verification failed"
      );
    }
  };

  // 🔹 REGISTER
  const register = async (
    email: string,
    password: string
  ) => {

    const res =
      await api.register(
        email,
        password
      );

    if (!res.message) {
      throw new Error(
        "Register failed"
      );
    }
  };

  // 🔹 UPDATE PROFILE
  const updateProfile = async (
    data: Partial<User>
  ) => {

    try {

      const updated =
        await api.updateProfile(data);

      console.log(
        "UPDATED USER:",
        updated
      );

      // ✅ backend returns { user }
      setUser(updated.updatedUser || updated.user);

      // ✅ save latest user
      localStorage.setItem(
  "user",
  JSON.stringify(
    updated.updatedUser || updated.user
  )
);

    } catch (err) {

      console.log(err);
      throw err;
    }
  };

  // 🔹 LOGOUT
  const logout = () => {

    api.logout();

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        sendOtp,
        verifyOtp,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};