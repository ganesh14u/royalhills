import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Clock, Building } from "lucide-react";

interface Tenant {
  id: string;
  email: string;
  full_name: string | null;
  mobile: string | null;
  allocation?: {
    room_number: string;
    room_type: string;
    rent_amount: number;
    rent_expiry_date: string;
    payment_status: string;
  };
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  monthly_rent: number;
  capacity: number;
  is_available: boolean;
  amenities: string[];
}

interface AdminOverviewProps {
  tenants: Tenant[];
  rooms: Room[];
}

const AdminOverview = ({ tenants, rooms }: AdminOverviewProps) => {
  // Calculate tenant count per room
  const tenantCountByRoom: { [key: string]: number } = {};
  tenants.forEach(tenant => {
    if (tenant.allocation?.room_number) {
      tenantCountByRoom[tenant.allocation.room_number] = (tenantCountByRoom[tenant.allocation.room_number] || 0) + 1;
    }
  });

  // Calculate total vacancies in all rooms
  const totalVacancies = rooms
    .reduce((sum, room) => {
      const tenantCount = tenantCountByRoom[room.room_number] || 0;
      return sum + Math.max(0, room.capacity - tenantCount);
    }, 0);

  const stats = {
    totalTenants: tenants.length,
    activeRents: tenants.filter(t => t.allocation?.payment_status === 'paid').length,
    pendingPayments: tenants.filter(t => t.allocation?.payment_status === 'pending').length,
    availableRooms: totalVacancies,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground font-body">
          Manage Royal Hills PG operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-body mb-1">
                  Total Tenants
                </p>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {stats.totalTenants}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-body mb-1">
                  Active Rents
                </p>
                <h3 className="font-display text-2xl font-bold text-green-600">
                  {stats.activeRents}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-body mb-1">
                  Pending Payments
                </p>
                <h3 className="font-display text-2xl font-bold text-amber-600">
                  {stats.pendingPayments}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-body mb-1">
                  Available Vacancies
                </p>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {stats.availableRooms}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Building className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.slice(0, 5).map((tenant) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-display font-bold text-accent">
                      {(tenant.full_name || tenant.email)[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-body font-medium text-foreground">
                      {tenant.full_name || 'No Name'}
                    </h4>
                    <p className="text-muted-foreground text-sm font-body">
                      {tenant.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {tenant.allocation ? (
                    <>
                      <p className="font-body text-sm text-foreground">
                        Room {tenant.allocation.room_number}
                      </p>
                      <Badge
                        variant={tenant.allocation.payment_status === 'paid' ? 'secondary' : 'destructive'}
                        className={tenant.allocation.payment_status === 'paid'
                          ? 'bg-green-500/10 text-green-600'
                          : ''
                        }
                      >
                        {tenant.allocation.payment_status}
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline">No Room</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;