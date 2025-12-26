import { useState } from "react";
import { Link } from "react-router-dom";
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
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Phone,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const user = {
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    phone: "+91 9876543210",
    room: "Room 204",
    roomType: "Double Sharing",
    rentAmount: 8500,
    rentStartDate: "2024-01-15",
    rentExpiryDate: "2025-01-15",
    currentMonthPaid: true,
    nextDueDate: "2025-01-15",
  };

  const paymentHistory = [
    { id: 1, month: "December 2024", amount: 8500, status: "paid", date: "2024-12-01" },
    { id: 2, month: "November 2024", amount: 8500, status: "paid", date: "2024-11-01" },
    { id: 3, month: "October 2024", amount: 8500, status: "paid", date: "2024-10-02" },
    { id: 4, month: "September 2024", amount: 8500, status: "paid", date: "2024-09-01" },
  ];

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm ${user.name} from ${user.room} at Royal Hills PG. I would like to discuss my rent payment.`
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(user.nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground hidden lg:block">
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
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </Link>
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
            <span className="font-display font-bold">Royal Hills</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <LogOut className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="p-6 lg:p-10">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name.split(" ")[0]}!
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
                      {user.room}
                    </h3>
                    <p className="text-accent text-sm font-body">{user.roomType}</p>
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
                      {user.rentAmount.toLocaleString()}
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
                      {user.currentMonthPaid ? (
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
                      Next Due Date
                    </p>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {new Date(user.nextDueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </h3>
                    <p
                      className={`text-sm font-body ${
                        daysUntilDue <= 3
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {daysUntilDue} days remaining
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
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" className="w-full justify-start">
                      <MessageCircle className="w-5 h-5 mr-3" />
                      WhatsApp Reminder
                    </Button>
                  </a>
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
                      {new Date(user.rentStartDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-body">
                      Expiry Date
                    </span>
                    <span className="font-body font-medium">
                      {new Date(user.rentExpiryDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-gold rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs font-body text-center">
                    85% of your rent period completed
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
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-body font-medium text-foreground">
                            {payment.month}
                          </h4>
                          <p className="text-muted-foreground text-sm font-body flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(payment.date).toLocaleDateString("en-IN")}
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
                            className="bg-green-500/10 text-green-600"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
