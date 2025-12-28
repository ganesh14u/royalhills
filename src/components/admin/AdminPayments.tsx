import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CreditCard } from "lucide-react";

interface Payment {
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

interface AdminPaymentsProps {
  payments: Payment[];
}

const AdminPayments = ({ payments }: AdminPaymentsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Payment Management
        </h1>
        <p className="text-muted-foreground font-body">
          View all payment transactions
        </p>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Tenant</th>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Amount</th>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Date</th>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Method</th>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Transaction ID</th>
                  <th className="text-left p-4 font-body font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-border/50 hover:bg-secondary/20">
                    <td className="p-4 font-body">{payment.user?.full_name || payment.user?.email || 'N/A'}</td>
                    <td className="p-4 font-body">
                      <span className="flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 font-body">
                      {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 font-body capitalize">{payment.payment_method}</td>
                    <td className="p-4 font-body">{payment.transaction_id || 'N/A'}</td>
                    <td className="p-4">
                      <Badge
                        variant={payment.status === 'success' ? 'secondary' : 'destructive'}
                        className={payment.status === 'success' ? 'bg-green-500/10 text-green-600' : ''}
                      >
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;