import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RentAllocation {
  id: string;
  user_id: string;
  room_id: string | null;
  rent_amount: number;
  rent_start_date: string;
  rent_expiry_date: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
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
  transaction_id: string | null;
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

  useEffect(() => {
    if (user) {
      fetchRentData();
      fetchPayments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRentData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rent_allocations')
        .select(`
          *,
          room:rooms(room_number, room_type, amenities)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching rent data:', error);
      }

      if (data) {
        setAllocation(data as RentAllocation);
        calculateRentStatus(data.rent_expiry_date, data.payment_status);
      }
    } catch (err) {
      console.error('Error in fetchRentData:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      setPayments(data || []);
    } catch (err) {
      console.error('Error in fetchPayments:', err);
    }
  };

  const calculateRentStatus = (expiryDateStr: string, paymentStatus: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setRentStatus({
      isActive: diffDays > 0 && paymentStatus === 'paid',
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
