import { createContext } from "react";
import { AuthContextType } from "./authTypes";

/* ================================
    CONTEXT
=============================== */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);