import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuthHook";
import axios from "axios";

interface RentAllocation {
  id: string;
  rent_amount: number;
  rent_start_date: string;
  rent_expiry_date: string;
  payment_status: string;
  room?: {
    room_number: string;
    room_type: string;
    amenities: string[];
  };
}

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
}

interface RentStatus {
  isActive: boolean;
  isExpiringSoon: boolean;
  isExpired: boolean;
  daysUntilExpiry: number;
}

export const useRentData = () => {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState<RentAllocation | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rentStatus, setRentStatus] = useState<RentStatus>({
    isActive: false,
    isExpiringSoon: false,
    isExpired: false,
    daysUntilExpiry: 0,
  });

  const fetchRentData = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/admin/tenants/allocation/${user.id}`,
        { withCredentials: true }
      );

      const data = res.data?.allocation;

      if (!data) {
        setAllocation(null);
        return;
      }

      setAllocation({
        id: data._id || data.id,
        rent_amount: data.rent_amount ?? 0,
        rent_start_date: data.rent_start_date ?? "",
        rent_expiry_date: data.rent_expiry_date ?? "",
        payment_status: data.payment_status ?? "pending",
        room: data.room
          ? {
              room_number: data.room.room_number ?? "N/A",
              room_type: data.room.room_type ?? "N/A",
              amenities: data.room.amenities ?? [],
            }
          : undefined,
      });

      if (data.rent_expiry_date) {
        calculateRentStatus(data.rent_expiry_date, data.payment_status);
      }
    } catch (err) {
      console.error("Error fetching rent data", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPayments = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/admin/payments/${user.id}`,
        { withCredentials: true }
      );
      setPayments(res.data ?? []);
    } catch (err) {
      console.error("Error fetching payments", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRentData();
      fetchPayments();
    } else {
      setLoading(false);
    }
  }, [user, fetchRentData, fetchPayments]);

  const calculateRentStatus = (expiryDateStr: string, paymentStatus: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setRentStatus({
      isActive: diffDays > 0 && paymentStatus === "paid",
      isExpiringSoon: diffDays > 0 && diffDays <= 3,
      isExpired: diffDays <= 0,
      daysUntilExpiry: diffDays,
    });
  };

  return {
    allocation,
    payments,
    loading,
    rentStatus,
    refetch: () => {
      fetchRentData();
      fetchPayments();
    },
  };
};
