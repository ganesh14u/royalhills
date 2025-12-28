export const getRentStatus = (expiryDate: string | undefined): string => {
  if (!expiryDate) return "unknown";

  const today = new Date();
  const expiry = new Date(expiryDate);

  if (expiry < today) {
    return "overdue";
  }

  return "active";
};