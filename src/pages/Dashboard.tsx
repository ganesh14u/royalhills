import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Home,
  CreditCard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Calendar,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Phone,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";
import { useRentData } from "@/hooks/useRentData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { allocation, payments, loading: rentLoading, rentStatus } = useRentData();
  const [activeTab, setActiveTab] = useState("overview");
  const [showExpiryBanner, setShowExpiryBanner] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || rentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.fullName || user.email?.split('@')[0] || 'User';
  const roomNumber = allocation?.room?.room_number || 'Not Assigned';
  const roomType = allocation?.room?.room_type 
    ? `${allocation.room.room_type.charAt(0).toUpperCase() + allocation.room.room_type.slice(1)} Sharing`
    : 'N/A';
  const rentAmount = allocation?.rent_amount || 0;
  const rentStartDate = allocation?.rent_start_date;
  const rentExpiryDate = allocation?.rent_expiry_date;
  const paymentStatus = allocation?.payment_status || 'pending';

  const getRentProgress = () => {
    if (!rentStartDate || !rentExpiryDate) return 0;
    const start = new Date(rentStartDate).getTime();
    const end = new Date(rentExpiryDate).getTime();
    const now = new Date().getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Rent Expiry Warning Banner */}
      {(rentStatus.isExpiringSoon || rentStatus.isExpired) && showExpiryBanner && (
        <div className={`fixed top-0 left-0 right-0 z-50 p-4 ${
          rentStatus.isExpired ? 'bg-destructive' : 'bg-amber-500'
        } text-white`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-body font-medium">
                {rentStatus.isExpired 
                  ? `⚠️ Your rent has expired! Please pay immediately.`
                  : `⚠️ Your rent will expire in ${rentStatus.daysUntilExpiry} day${rentStatus.daysUntilExpiry !== 1 ? 's' : ''}!`
                }
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
              <button 
                onClick={() => setShowExpiryBanner(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 bottom-0 w-64 bg-primary text-primary-foreground hidden lg:block ${
        (rentStatus.isExpiringSoon || rentStatus.isExpired) && showExpiryBanner ? 'top-14' : 'top-0'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Crown className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Royal Hills</h1>
              <p className="text-xs text-primary-foreground/60">Dashboard</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "invoices", label: "Invoices", icon: FileText },
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
      <main className={`lg:ml-64 min-h-screen ${
        (rentStatus.isExpiringSoon || rentStatus.isExpired) && showExpiryBanner ? 'pt-14' : ''
      }`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Crown className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold">Royal Hills</span>
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground font-body">
              Here's an overview of your stay at Royal Hills PG.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-body mb-1">
                      Your Room
                    </p>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {roomNumber}
                    </h3>
                    <p className="text-accent text-sm font-body">{roomType}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Home className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-body mb-1">
                      Monthly Rent
                    </p>
                    <h3 className="font-display text-xl font-bold text-foreground flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {rentAmount.toLocaleString()}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body">
                      Per month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-body mb-1">
                      Payment Status
                    </p>
                    <div className="flex items-center gap-2">
                      {paymentStatus === 'paid' ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <Badge className="bg-green-500/10 text-green-600 border-green-200">
                            Paid
                          </Badge>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <Badge variant="destructive">Due</Badge>
                        </>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm font-body mt-1">
                      Current month
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    paymentStatus === 'paid' ? 'bg-green-500/10' : 'bg-destructive/10'
                  }`}>
                    {paymentStatus === 'paid' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-body mb-1">
                      Rent Expiry
                    </p>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {rentExpiryDate 
                        ? new Date(rentExpiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : 'N/A'
                      }
                    </h3>
                    <p
                      className={`text-sm font-body ${
                        rentStatus.isExpired
                          ? "text-destructive font-semibold"
                          : rentStatus.isExpiringSoon
                          ? "text-amber-500 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {rentStatus.isExpired 
                        ? 'Expired!'
                        : rentStatus.daysUntilExpiry > 0 
                        ? `${rentStatus.daysUntilExpiry} days remaining`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions & Payment History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="gold" className="w-full justify-start">
                    <CreditCard className="w-5 h-5 mr-3" />
                    Pay Rent Now
                  </Button>
                  <a href="tel:+919876543210" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-5 h-5 mr-3" />
                      Contact Support
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Rent Period */}
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Rent Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-body">
                      Start Date
                    </span>
                    <span className="font-body font-medium">
                      {rentStartDate 
                        ? new Date(rentStartDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-body">
                      Expiry Date
                    </span>
                    <span className={`font-body font-medium ${
                      rentStatus.isExpired ? 'text-destructive' : 
                      rentStatus.isExpiringSoon ? 'text-amber-500' : ''
                    }`}>
                      {rentExpiryDate 
                        ? new Date(rentExpiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        rentStatus.isExpired ? 'bg-destructive' :
                        rentStatus.isExpiringSoon ? 'bg-amber-500' :
                        'bg-gradient-gold'
                      }`}
                      style={{ width: `${getRentProgress()}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs font-body text-center">
                    {Math.round(getRentProgress())}% of your rent period completed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card className="lg:col-span-2 shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">
                  Payment History
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            payment.status === 'success' ? 'bg-green-500/10' : 'bg-destructive/10'
                          }`}>
                            {payment.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-body font-medium text-foreground">
                              {new Date(payment.payment_date).toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                              })}
                            </h4>
                            <p className="text-muted-foreground text-sm font-body flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(payment.payment_date).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-body font-semibold text-foreground flex items-center">
                              <IndianRupee className="w-4 h-4" />
                              {payment.amount.toLocaleString()}
                            </p>
                            <Badge
                              variant="secondary"
                              className={payment.status === 'success' 
                                ? "bg-green-500/10 text-green-600"
                                : "bg-destructive/10 text-destructive"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-body">No payment history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
