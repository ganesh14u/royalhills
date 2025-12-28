import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Crown,
  Home,
  LogOut,
  BarChart3,
  Users,
  Building,
  CreditCard,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";
import {
  api,
  Tenant,
  Room,
  Payment,
  AdminSettings,
} from "@/integrations/mongodb/api";
import { toast } from "@/hooks/use-toast";

// Admin Components
import AdminOverview from "@/components/admin/AdminOverview";
import AdminTenants from "@/components/admin/AdminTenants";
import AdminRooms from "@/components/admin/AdminRooms";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminSettingsComponent from "@/components/admin/AdminSettings";

/* ================= NAV ================= */

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "rooms", label: "Rooms", icon: Building },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ================= SAFE CLOSE (a11y fix) ================= */

const blurActiveElement = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchTenants = useCallback(async () => {
    setTenants(await api.getTenants());
  }, []);

  const fetchRooms = useCallback(async () => {
    setRooms(await api.getRooms());
  }, []);

  const fetchPayments = useCallback(async () => {
    setPayments(await api.getPayments());
  }, []);

  const fetchSettings = useCallback(async () => {
    setSettings(await api.getSettings());
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTenants(),
        fetchRooms(),
        fetchPayments(),
        fetchSettings(),
      ]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [fetchTenants, fetchRooms, fetchPayments, fetchSettings]);

  /* ================= AUTH ================= */

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (userRole !== "admin") {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "Admin access only",
        variant: "destructive",
      });
      return;
    }

    fetchAllData();
  }, [authLoading, user, userRole, navigate, fetchAllData]);

  /* ================= ACTIONS ================= */

  const handleLogout = async () => {
    blurActiveElement();
    await signOut();
    navigate("/");
  };

  const handleDashboard = () => navigate('/dashboard');

  const updateSettings = async (updates: Partial<AdminSettings>) => {
    if (!settings) return;
    await api.updateSettings(updates);
    setSettings(prev => ({ ...prev!, ...updates }));
    toast({ title: "Settings Updated" });
  };

  const addRoom = async (roomData: Omit<Room, "id">) => {
    const room = await api.addRoom(roomData);
    setRooms(prev => [...prev, room]);
    toast({ title: "Room Added" });
  };

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    await api.updateRoom(roomId, updates);
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, ...updates } : r))
    );
    toast({ title: "Room Updated" });
  };

  const deleteRoom = async (roomId: string) => {
    if (!window.confirm("Delete this room permanently?")) return;
    await api.deleteRoom(roomId);
    setRooms(prev => prev.filter(r => r.id !== roomId));
    toast({ title: "Room Deleted" });
  };

  const updateTenant = async (
    tenantId: string,
    profileUpdates: { full_name?: string; mobile?: string },
    allocationUpdates?: {
      room_id?: string;
      rent_amount?: number;
      rent_expiry_date?: string;
      payment_status?: string;
    }
  ) => {
    await api.updateTenant(tenantId, {
      profileUpdates,
      allocationUpdates,
    });
    await fetchTenants();
    await fetchRooms();
    toast({ title: "Tenant Updated" });
  };

  /* ================= DERIVED ================= */

  const roomsWithOccupancy = rooms.map(room => {
    const occupants = tenants.filter(
      t => t.allocation?.room_id === room.id
    ).length;

    return {
      ...room,
      occupants,
      vacancies: Math.max(room.capacity - occupants, 0),
    };
  });

  /* ================= LOADING ================= */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background">
      {/* ============ MOBILE HEADER ============ */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-accent" />
          <span className="font-bold">Royal Hills</span>
        </div>

        <Sheet
          open={mobileMenuOpen}
          onOpenChange={open => {
            if (!open) blurActiveElement();
            setMobileMenuOpen(open);
          }}
        >
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <Sidebar
              activeTab={activeTab}
              onTabSelect={id => {
                blurActiveElement();
                setActiveTab(id);
                setMobileMenuOpen(false);
              }}
              onDashboard={() => {
                blurActiveElement();
                handleDashboard();
                setMobileMenuOpen(false);
              }}
              onLogout={() => {
                blurActiveElement();
                setMobileMenuOpen(false);
                handleLogout();
              }}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64">
        <Sidebar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          onDashboard={handleDashboard}
          onLogout={handleLogout}
        />
      </aside>

      {/* ============ CONTENT ============ */}
      <main className="lg:ml-64 p-6 lg:p-10">
        {activeTab === "overview" && (
          <AdminOverview tenants={tenants} rooms={rooms} />
        )}
        {activeTab === "tenants" && (
          <AdminTenants
            tenants={tenants}
            rooms={rooms}
            onUpdateTenant={updateTenant}
            onRefreshRooms={fetchRooms}
            onRefreshTenants={fetchTenants}
          />
        )}
        {activeTab === "rooms" && (
          <AdminRooms
            rooms={roomsWithOccupancy}
            onAddRoom={addRoom}
            onUpdateRoom={updateRoom}
            onDeleteRoom={deleteRoom}
          />
        )}
        {activeTab === "payments" && (
          <AdminPayments payments={payments} />
        )}
        {activeTab === "notifications" && (
          <AdminNotifications tenants={tenants} />
        )}
        {activeTab === "settings" && (
          <AdminSettingsComponent
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;

/* ================= SIDEBAR ================= */

const Sidebar = ({
  activeTab,
  onTabSelect,
  onDashboard,
  onLogout,
}: {
  activeTab: string;
  onTabSelect: (id: string) => void;
  onDashboard: () => void;
  onLogout: () => void;
}) => (
  <div className="h-full bg-primary text-primary-foreground flex flex-col p-6">
    <Link to="/" className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
        <Crown className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-bold">Royal Hills</h1>
        <p className="text-xs opacity-70">Admin Panel</p>
      </div>
    </Link>

    <Badge className="mb-6 w-fit">Administrator</Badge>

    <nav className="space-y-2 flex-1">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onTabSelect(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
            activeTab === item.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-white/10"
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}
    </nav>

    <Button variant="ghost" className="justify-start mb-2" onClick={onDashboard}>
      <Home className="w-4 h-4 mr-2" />
      Dashboard
    </Button>
    <Button variant="ghost" className="justify-start" onClick={onLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  </div>
);
