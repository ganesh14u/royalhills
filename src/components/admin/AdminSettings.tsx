import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee } from "lucide-react";

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

interface AdminSettingsProps {
  settings: AdminSettingsType | null;
  onUpdateSettings: (updates: Partial<AdminSettingsType>) => Promise<void>;
}

const AdminSettings = ({ settings, onUpdateSettings }: AdminSettingsProps) => {
  if (!settings) {
    return <div>Loading settings...</div>;
  }

  const handleUpdateSettings = async (updates: Partial<AdminSettingsType>) => {
    await onUpdateSettings(updates);
  };

  return (
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
                  onCheckedChange={(checked) => handleUpdateSettings({ payments_enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                <Input
                  id="razorpay_key_id"
                  value={settings.razorpay_key_id || ''}
                  onChange={(e) => handleUpdateSettings({ razorpay_key_id: e.target.value })}
                  placeholder="rzp_test_xxxxxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpay_key_secret">Razorpay Key Secret</Label>
                <Input
                  id="razorpay_key_secret"
                  type="password"
                  value={settings.razorpay_key_secret || ''}
                  onChange={(e) => handleUpdateSettings({ razorpay_key_secret: e.target.value })}
                  placeholder="Enter your secret key"
                />
              </div>
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
                  onChange={(e) => handleUpdateSettings({ bank_account_name: e.target.value })}
                  placeholder="Royal Hills PG"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_account_number">Account Number</Label>
                <Input
                  id="bank_account_number"
                  value={settings.bank_account_number || ''}
                  onChange={(e) => handleUpdateSettings({ bank_account_number: e.target.value })}
                  placeholder="Enter account number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_ifsc">IFSC Code</Label>
                <Input
                  id="bank_ifsc"
                  value={settings.bank_ifsc || ''}
                  onChange={(e) => handleUpdateSettings({ bank_ifsc: e.target.value })}
                  placeholder="HDFC0001234"
                />
              </div>
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
                    onChange={(e) => handleUpdateSettings({ single_room_rent: Number(e.target.value) })}
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
                    onChange={(e) => handleUpdateSettings({ double_room_rent: Number(e.target.value) })}
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
                    onChange={(e) => handleUpdateSettings({ triple_room_rent: Number(e.target.value) })}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;