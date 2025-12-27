import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Users,
  Home,
  CreditCard,
  Settings,
  LogOut,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Clock,
  Building,
  Bell,
  BarChart3,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

interface AdminSettingsType {
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

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [settings, setSettings] = useState<AdminSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isAdmin) {
        navigate("/dashboard");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
      } else {
        fetchData();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchTenants(),
      fetchRooms(),
      fetchSettings(),
    ]);
    setLoading(false);
  };

  const fetchTenants = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      // Fetch allocations for each tenant
      const tenantsWithAllocations = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: allocation } = await supabase
            .from('rent_allocations')
            .select(`
              rent_amount,
              rent_expiry_date,
              payment_status,
              room:rooms(room_number, room_type)
            `)
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...profile,
            allocation: allocation ? {
              room_number: allocation.room?.room_number || 'N/A',
              room_type: allocation.room?.room_type || 'N/A',
              rent_amount: allocation.rent_amount,
              rent_expiry_date: allocation.rent_expiry_date,
              payment_status: allocation.payment_status,
            } : undefined,
          };
        })
      );

      setTenants(tenantsWithAllocations);
    } catch (err) {
      console.error('Error fetching tenants:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const updateSettings = async (updates: Partial<AdminSettingsType>) => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from('admin_settings')
        .update(updates)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings({ ...settings, ...updates });
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTenants = tenants.filter(tenant => 
    tenant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.mobile?.includes(searchQuery)
  );

  const stats = {
    totalTenants: tenants.length,
    activeRents: tenants.filter(t => t.allocation?.payment_status === 'paid').length,
    pendingPayments: tenants.filter(t => t.allocation?.payment_status === 'pending').length,
    availableRooms: rooms.filter(r => r.is_available).length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground hidden lg:block">
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Crown className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Royal Hills</h1>
              <p className="text-xs text-primary-foreground/60">Admin Panel</p>
            </div>
          </Link>

          <Badge className="bg-accent/20 text-accent border-accent/30 mb-8">
            Administrator
          </Badge>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "tenants", label: "Tenants", icon: Users },
              { id: "rooms", label: "Rooms", icon: Building },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                  activeTab === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Crown className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold">Admin Panel</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 lg:p-10">
          {/* Overview Tab */}
          {activeTab === "overview" && (
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
                          Available Rooms
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
          )}

          {/* Tenants Tab */}
          {activeTab === "tenants" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Manage Tenants
                  </h1>
                  <p className="text-muted-foreground font-body">
                    View and manage all tenants
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card className="shadow-soft border-border/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Name</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Email</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Mobile</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Room</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Rent</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Expiry</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Status</th>
                          <th className="text-left p-4 font-body font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants.map((tenant) => (
                          <tr key={tenant.id} className="border-t border-border/50 hover:bg-secondary/20">
                            <td className="p-4 font-body">{tenant.full_name || 'N/A'}</td>
                            <td className="p-4 font-body text-muted-foreground">{tenant.email}</td>
                            <td className="p-4 font-body">{tenant.mobile || 'N/A'}</td>
                            <td className="p-4 font-body">{tenant.allocation?.room_number || 'N/A'}</td>
                            <td className="p-4 font-body">
                              {tenant.allocation ? (
                                <span className="flex items-center">
                                  <IndianRupee className="w-3 h-3" />
                                  {tenant.allocation.rent_amount.toLocaleString()}
                                </span>
                              ) : 'N/A'}
                            </td>
                            <td className="p-4 font-body">
                              {tenant.allocation?.rent_expiry_date 
                                ? new Date(tenant.allocation.rent_expiry_date).toLocaleDateString('en-IN')
                                : 'N/A'
                              }
                            </td>
                            <td className="p-4">
                              {tenant.allocation ? (
                                <Badge
                                  variant={tenant.allocation.payment_status === 'paid' ? 'secondary' : 'destructive'}
                                  className={tenant.allocation.payment_status === 'paid' 
                                    ? 'bg-green-500/10 text-green-600'
                                    : ''
                                  }
                                >
                                  {tenant.allocation.payment_status}
                                </Badge>
                              ) : (
                                <Badge variant="outline">No Allocation</Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Manage Rooms
                  </h1>
                  <p className="text-muted-foreground font-body">
                    View and manage all rooms
                  </p>
                </div>
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <Card key={room.id} className="shadow-soft border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-display text-lg">
                          Room {room.room_number}
                        </CardTitle>
                        <Badge variant={room.is_available ? 'secondary' : 'destructive'}>
                          {room.is_available ? 'Available' : 'Occupied'}
                        </Badge>
                      </div>
                      <CardDescription className="capitalize">
                        {room.room_type} Sharing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Monthly Rent</span>
                        <span className="font-body font-semibold flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {room.monthly_rent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Capacity</span>
                        <span className="font-body">{room.capacity} person(s)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && settings && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Settings
                </h1>
                <p className="text-muted-foreground font-body">
                  Configure payment gateway and rent settings
                </p>
              </div>

              <Tabs defaultValue="razorpay" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
                  <TabsTrigger value="bank">Bank Details</TabsTrigger>
                  <TabsTrigger value="rent">Rent Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="razorpay">
                  <Card className="shadow-soft border-border/50">
                    <CardHeader>
                      <CardTitle className="font-display">Razorpay Configuration</CardTitle>
                      <CardDescription>Configure your Razorpay payment gateway</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-body">Enable Payments</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow tenants to pay rent online
                          </p>
                        </div>
                        <Switch
                          checked={settings.payments_enabled}
                          onCheckedChange={(checked) => updateSettings({ payments_enabled: checked })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                        <Input
                          id="razorpay_key_id"
                          value={settings.razorpay_key_id || ''}
                          onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                          placeholder="rzp_test_xxxxxxxxxxxxx"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="razorpay_key_secret">Razorpay Key Secret</Label>
                        <Input
                          id="razorpay_key_secret"
                          type="password"
                          value={settings.razorpay_key_secret || ''}
                          onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
                          placeholder="Enter your secret key"
                        />
                      </div>

                      <Button 
                        variant="gold"
                        onClick={() => updateSettings({
                          razorpay_key_id: settings.razorpay_key_id,
                          razorpay_key_secret: settings.razorpay_key_secret,
                        })}
                      >
                        Save Razorpay Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bank">
                  <Card className="shadow-soft border-border/50">
                    <CardHeader>
                      <CardTitle className="font-display">Bank Account Details</CardTitle>
                      <CardDescription>Your bank account for receiving payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank_account_name">Account Holder Name</Label>
                        <Input
                          id="bank_account_name"
                          value={settings.bank_account_name || ''}
                          onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
                          placeholder="Royal Hills PG"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bank_account_number">Account Number</Label>
                        <Input
                          id="bank_account_number"
                          value={settings.bank_account_number || ''}
                          onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                          placeholder="Enter account number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bank_ifsc">IFSC Code</Label>
                        <Input
                          id="bank_ifsc"
                          value={settings.bank_ifsc || ''}
                          onChange={(e) => setSettings({ ...settings, bank_ifsc: e.target.value })}
                          placeholder="HDFC0001234"
                        />
                      </div>

                      <Button 
                        variant="gold"
                        onClick={() => updateSettings({
                          bank_account_name: settings.bank_account_name,
                          bank_account_number: settings.bank_account_number,
                          bank_ifsc: settings.bank_ifsc,
                        })}
                      >
                        Save Bank Details
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rent">
                  <Card className="shadow-soft border-border/50">
                    <CardHeader>
                      <CardTitle className="font-display">Room-wise Rent Pricing</CardTitle>
                      <CardDescription>Set default monthly rent for each room type</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="single_room_rent">Single Room Rent</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="single_room_rent"
                            type="number"
                            value={settings.single_room_rent}
                            onChange={(e) => setSettings({ ...settings, single_room_rent: Number(e.target.value) })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="double_room_rent">Double Room Rent</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="double_room_rent"
                            type="number"
                            value={settings.double_room_rent}
                            onChange={(e) => setSettings({ ...settings, double_room_rent: Number(e.target.value) })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="triple_room_rent">Triple Room Rent</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="triple_room_rent"
                            type="number"
                            value={settings.triple_room_rent}
                            onChange={(e) => setSettings({ ...settings, triple_room_rent: Number(e.target.value) })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <Button 
                        variant="gold"
                        onClick={() => updateSettings({
                          single_room_rent: settings.single_room_rent,
                          double_room_rent: settings.double_room_rent,
                          triple_room_rent: settings.triple_room_rent,
                        })}
                      >
                        Save Rent Pricing
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
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
                <CardContent className="p-8 text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display text-lg font-semibold mb-2">
                    Payment History Coming Soon
                  </h3>
                  <p className="text-muted-foreground font-body">
                    View and manage all payment transactions here
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Notifications
                </h1>
                <p className="text-muted-foreground font-body">
                  Send rent reminders and announcements
                </p>
              </div>

              <Card className="shadow-soft border-border/50">
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display text-lg font-semibold mb-2">
                    Notification Center Coming Soon
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Send bulk WhatsApp and email reminders to tenants
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
