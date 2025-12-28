import axios from "axios";

/* ============================
   Axios Instance
============================ */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // your backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   Types
============================ */
export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  amenities: string[];
  rent_amount: number;
  monthly_rent: number; // needed for Admin components
  capacity: number;     // needed for Admin components
  is_available: boolean;
}

export interface Tenant {
  id: string;
  full_name: string | null;
  email: string;
  mobile: string | null;
  allocation?: {
    room_id: string;
    room_number: string;
    room_type: string;
    rent_amount: number;
    rent_expiry_date: string;
    payment_status: string;
  };
}

interface TenantUpdatePayload {
  profileUpdates?: {
    full_name?: string;
    email?: string;
    mobile?: string;
  };
  allocationUpdates?: {
    room_id?: string;
    rent_amount?: number;
    rent_expiry_date?: string;
    payment_status?: string;
  };
}

export interface Payment {
  id: string;
  user_id: string;
  allocation_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  user?: { email: string; full_name: string | null };
}

export interface AdminSettings {
  id: string;
  razorpay_key_id: string | null;
  razorpay_key_secret: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  payments_enabled: boolean;
  single_room_rent: number;
  double_room_rent: number;
  triple_room_rent: number;
}

/* ============================
   API METHODS
============================ */
export const api = {
  /* -------- TENANTS -------- */
  async getTenants(): Promise<Tenant[]> {
    const res = await apiClient.get("/admin/tenants");
    return res.data;
  },

  async updateTenant(tenantId: string, updates: TenantUpdatePayload): Promise<Tenant> {
    const res = await apiClient.put(`/admin/tenants/${tenantId}`, updates);
    return res.data;
  },

  /* -------- ROOMS -------- */
  async getRooms(): Promise<Room[]> {
    const res = await apiClient.get("/rooms");
    return res.data;
  },

  async addRoom(roomData: Omit<Room, "id">): Promise<Room> {
    const res = await apiClient.post("/rooms", roomData);
    return res.data;
  },

  async updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
    const res = await apiClient.put(`/rooms/${roomId}`, updates);
    return res.data;
  },

  async deleteRoom(roomId: string): Promise<void> {
    await apiClient.delete(`/rooms/${roomId}`);
  },

  /* -------- PAYMENTS -------- */
  async getPayments(): Promise<Payment[]> {
    const res = await apiClient.get("/admin/payments");
    return res.data;
  },

  /* -------- SETTINGS -------- */
  async getSettings(): Promise<AdminSettings> {
    const res = await apiClient.get("/admin/settings");
    return res.data;
  },

  async updateSettings(newSettings: Partial<AdminSettings>): Promise<AdminSettings> {
    const res = await apiClient.put("/admin/settings", newSettings);
    return res.data;
  },
};
