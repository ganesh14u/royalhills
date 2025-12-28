import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  email: string;
  full_name: string | null;
  mobile: string | null;
}

interface AdminNotificationsProps {
  tenants: Tenant[];
}

const AdminNotifications = ({ tenants }: AdminNotificationsProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);

  const handleSendNotification = () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending notification
    toast({
      title: "Notification Sent",
      description: `Notification sent to ${tenants.length} tenants via ${sendEmail ? 'Email' : ''}${sendEmail && sendWhatsApp ? ' and ' : ''}${sendWhatsApp ? 'WhatsApp' : ''}.`,
    });

    // Clear form
    setSubject("");
    setMessage("");
  };

  return (
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
        <CardHeader>
          <CardTitle className="font-display">Send Notification</CardTitle>
          <CardDescription>Send bulk notifications to all tenants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Rent Due Reminder"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your notification message..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="send_email"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <Label htmlFor="send_email">Send via Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="send_whatsapp"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
              />
              <Label htmlFor="send_whatsapp">Send via WhatsApp</Label>
            </div>
          </div>
          <Button variant="gold" onClick={handleSendNotification}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;