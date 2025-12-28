import { useEffect, useState, ReactNode } from "react";
import { api } from "@/integrations/mongodb/apiClient";
import { User } from "./authTypes";
import { AuthContext } from "./AuthContext";

/* ================================
    PROVIDER
=============================== */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = userRole === "admin";

  /* ================================
      FETCH CURRENT USER ON REFRESH
  ================================ */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("auth/me");
        setUser(res.data.user);
        setUserRole(res.data.user.role);
      } catch (err: unknown) {
        console.error("Error fetching current user:", err);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  /* ================================
      LOGIN
  ================================ */
  const signIn = async (email: string, password: string) => {
    try {
      await api.post("/auth/login", { email, password });
      const res = await api.get("auth/me");

      setUser(res.data.user);
      setUserRole(res.data.user.role);

      return { error: null };
    } catch (err: unknown) {
      let message = "Invalid email or password";
      if (err instanceof Error && err.message) message = err.message;
      return { error: message };
    }
  };

  /* ================================
      REGISTER
  ================================ */
  const signUp = async (email: string, password: string, fullName: string, mobile: string) => {
    try {
      await api.post("auth/register", { email, password, fullName, mobile });
      return { error: null };
    } catch (err: unknown) {
      let message = "Registration failed";
      if (err instanceof Error && err.message) message = err.message;
      return { error: message };
    }
  };

  /* ================================
      LOGOUT
  ================================ */
  const signOut = async () => {
    try {
      await api.post("auth/logout");
    } catch (err: unknown) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
