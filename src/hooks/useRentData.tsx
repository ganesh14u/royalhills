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
        `http://localhost:4000/api/rent/allocation/${user.id}`,
        { withCredentials: true }
      );

      setAllocation(res.data);
      calculateRentStatus(
        res.data.rent_expiry_date,
        res.data.payment_status
      );
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
        `http://localhost:4000/api/payments/${user.id}`,
        { withCredentials: true }
      );
      setPayments(res.data);
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

  const calculateRentStatus = (
    expiryDateStr: string,
    paymentStatus: string
  ) => {
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
