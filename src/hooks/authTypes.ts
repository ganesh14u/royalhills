/* ================================
    TYPES
=============================== */
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  mobile?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, mobile: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}