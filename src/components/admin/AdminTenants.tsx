import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Edit, Download, Search } from "lucide-react";

interface Tenant {
  id: string;
  email: string;
  full_name: string | null;
  mobile: string | null;
  allocation?: {
    room_id: string;
    room_number: string;
    room_type: string;
    rent_amount?: number;
    rent_expiry_date?: string;
    payment_status?: string;
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

interface AdminTenantsProps {
  tenants: Tenant[];
  rooms: Room[];
  onUpdateTenant: (
    tenantId: string,
    profileUpdates: { full_name?: string; mobile?: string },
    allocationUpdates?: { room_id?: string | null; rent_amount?: number; rent_expiry_date?: string; payment_status?: string }
  ) => Promise<void>;
  onRefreshRooms: () => Promise<void>;
  onRefreshTenants: () => Promise<void>;
}

const AdminTenants = ({ tenants, rooms, onUpdateTenant, onRefreshRooms, onRefreshTenants }: AdminTenantsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getOneMonthFromNow = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.mobile?.includes(searchQuery)
  );

  // Calculate current occupancy for each room
  const getRoomOccupancy = (roomId: string) => {
    return tenants.filter(tenant => tenant.allocation?.room_id === roomId).length;
  };

  // Get available rooms with remaining capacity
  const getAvailableRooms = () => {
    return rooms.map(room => {
      const currentOccupancy = getRoomOccupancy(room.id);
      const remainingCapacity = room.capacity - currentOccupancy;
      return {
        ...room,
        currentOccupancy,
        remainingCapacity,
        isAvailable: remainingCapacity > 0
      };
    });
  };

  const exportTenantsToCSV = () => {
    const csvContent = [
      ["Name", "Email", "Mobile", "Room", "Rent Amount", "Expiry Date", "Payment Status"],
      ...filteredTenants.map((tenant) => [
        tenant.full_name || "N/A",
        tenant.email,
        tenant.mobile || "N/A",
        tenant.allocation?.room_number || "N/A",
        tenant.allocation?.rent_amount?.toString() || "N/A",
        tenant.allocation?.rent_expiry_date
          ? new Date(tenant.allocation.rent_expiry_date).toLocaleDateString("en-IN")
          : "N/A",
        tenant.allocation?.payment_status || "N/A",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tenants.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveTenant = async () => {
    if (!editingTenant) return;

    // Validation: If a room is selected, ensure all required fields are filled
    if (editingTenant.allocation?.room_number && editingTenant.allocation.room_number !== "no-room") {
      if (!editingTenant.allocation.rent_amount || editingTenant.allocation.rent_amount <= 0) {
        alert("Please enter a valid rent amount");
        return;
      }
      if (!editingTenant.allocation.payment_status) {
        alert("Please select a payment status");
        return;
      }
    }

    // Find selected room object
    const selectedRoom = rooms.find((r) => r.room_number === editingTenant.allocation?.room_number);

    await onUpdateTenant(
      editingTenant.id,
      {
        full_name: editingTenant.full_name || null,
        mobile: editingTenant.mobile || null,
      },
      editingTenant.allocation && editingTenant.allocation.room_number !== "no-room"
        ? {
            room_id: selectedRoom?.id || null,
            rent_amount: editingTenant.allocation.rent_amount || selectedRoom?.monthly_rent || 0,
            rent_expiry_date: editingTenant.allocation.rent_expiry_date,
            payment_status: editingTenant.allocation.payment_status,
          }
        : { room_id: null }
    );

    await onRefreshRooms();
    await onRefreshTenants();
    setIsEditOpen(false);
    setEditingTenant(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Manage Tenants</h1>
          <p className="text-muted-foreground font-body">View and manage all tenants</p>
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
          <Button variant="outline" onClick={exportTenantsToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tenants Table */}
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
                    <td className="p-4 font-body">{tenant.full_name || "N/A"}</td>
                    <td className="p-4 font-body text-muted-foreground">{tenant.email}</td>
                    <td className="p-4 font-body">{tenant.mobile || "N/A"}</td>
                    <td className="p-4 font-body">{tenant.allocation?.room_number || "N/A"}</td>
                    <td className="p-4 font-body">
                      {tenant.allocation ? (
                        <span className="flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {tenant.allocation.rent_amount?.toLocaleString()}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-4 font-body">
                      {tenant.allocation?.rent_expiry_date
                        ? new Date(tenant.allocation.rent_expiry_date).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      {tenant.allocation ? (
                        <Badge
                          variant={tenant.allocation.payment_status === "paid" ? "secondary" : "destructive"}
                          className={tenant.allocation.payment_status === "paid" ? "bg-green-500/10 text-green-600" : ""}
                        >
                          {tenant.allocation.payment_status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">No Allocation</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={isEditOpen && editingTenant?.id === tenant.id}
                          onOpenChange={(open) => {
                            setIsEditOpen(open);
                            if (!open) setEditingTenant(null);
                          }}
                        >
                          <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const tenantToEdit = { ...tenant };
                              if (tenantToEdit.allocation && !tenantToEdit.allocation.rent_expiry_date) {
                                tenantToEdit.allocation.rent_expiry_date = getOneMonthFromNow();
                              }
                              setEditingTenant(tenantToEdit);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Tenant</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Name & Mobile */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="full_name">Full Name</Label>
                                  <Input
                                    id="full_name"
                                    value={editingTenant?.full_name || ""}
                                    onChange={(e) =>
                                      setEditingTenant({
                                        ...editingTenant!,
                                        full_name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="mobile">Mobile</Label>
                                  <Input
                                    id="mobile"
                                    value={editingTenant?.mobile || ""}
                                    onChange={(e) =>
                                      setEditingTenant({ ...editingTenant!, mobile: e.target.value })
                                    }
                                  />
                                </div>
                              </div>

                              {/* Room Assignment */}
                              <div className="space-y-2">
                                <Label>Room Assignment</Label>
                                <Select
                                  value={editingTenant?.allocation?.room_number || "no-room"}
                                  onValueChange={(value) => {
                                    if (value === "no-room") {
                                      setEditingTenant({ ...editingTenant!, allocation: undefined });
                                    } else {
                                      const selectedRoom = rooms.find((r) => r.room_number === value);
                                      setEditingTenant({
                                        ...editingTenant!,
                                        allocation: selectedRoom
                                          ? {
                                              room_id: selectedRoom.id,
                                              room_number: selectedRoom.room_number,
                                              room_type: selectedRoom.room_type,
                                              rent_amount: selectedRoom.monthly_rent,
                                              rent_expiry_date: editingTenant!.allocation?.rent_expiry_date || getOneMonthFromNow(),
                                              payment_status: editingTenant!.allocation?.payment_status || "pending",
                                            }
                                          : undefined,
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a room" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="no-room">No Room</SelectItem>
                                    {getAvailableRooms()
                                      .filter(
                                        (room) =>
                                          room.isAvailable ||
                                          room.room_number === editingTenant?.allocation?.room_number
                                      )
                                      .map((room) => (
                                        <SelectItem key={room.id} value={room.room_number}>
                                          Room {room.room_number} - {room.room_type} ({room.remainingCapacity} vacancy
                                          {room.remainingCapacity !== 1 ? "s" : ""} left - {room.currentOccupancy}/{room.capacity} occupied)
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Rent Amount */}
                              {editingTenant?.allocation && (
                                <div className="space-y-2">
                                  <Label htmlFor="rent_amount">Rent Amount</Label>
                                  <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                      id="rent_amount"
                                      type="number"
                                      value={editingTenant.allocation?.rent_amount || ""}
                                      onChange={(e) =>
                                        setEditingTenant({
                                          ...editingTenant!,
                                          allocation: {
                                            ...editingTenant!.allocation!,
                                            rent_amount: Number(e.target.value),
                                          },
                                        })
                                      }
                                      className="pl-10"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Rent Expiry Date */}
                              {editingTenant?.allocation && (
                                <div className="space-y-2">
                                  <Label htmlFor="rent_expiry_date">Rent Expiry Date</Label>
                                  <Input
                                    id="rent_expiry_date"
                                    type="date"
                                    value={editingTenant.allocation?.rent_expiry_date || ""}
                                    onChange={(e) =>
                                      setEditingTenant({
                                        ...editingTenant!,
                                        allocation: {
                                          ...editingTenant!.allocation!,
                                          rent_expiry_date: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              )}

                              {/* Payment Status */}
                              <div className="space-y-2">
                                <Label>Status</Label>
                                {editingTenant?.allocation ? (
                                  <Select
                                    value={editingTenant.allocation?.payment_status || "pending"}
                                    onValueChange={(value) =>
                                      setEditingTenant({
                                        ...editingTenant!,
                                        allocation: {
                                          ...editingTenant!.allocation!,
                                          payment_status: value,
                                        },
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="paid">Paid</SelectItem>
                                      <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="p-2 bg-muted rounded text-sm text-muted-foreground">Not Allocated</div>
                                )}
                              </div>

                              {/* Buttons */}
                              <div className="flex gap-2">
                                <Button onClick={handleSaveTenant}>Save Changes</Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditOpen(false);
                                    setEditingTenant(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
  );
};

export default AdminTenants;
