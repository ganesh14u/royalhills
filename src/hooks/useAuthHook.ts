import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./authTypes";

/* ================================
    CUSTOM HOOK
=============================== */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};