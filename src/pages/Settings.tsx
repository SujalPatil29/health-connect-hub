import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  Bell,
  Clock,
  Palette,
  Shield,
  Save,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [slotDuration, setSlotDuration] = useState("60");
  const [locationAccess, setLocationAccess] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and configurations
        </p>

        <div className="space-y-6">
          {/* Account */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" /> Account
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-xs">Role</Label>
              <p className="mt-1 text-sm font-medium text-foreground rounded-lg bg-secondary px-3 py-2 w-fit">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Push Notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive appointment reminders and updates
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Email Reminders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get email notifications before appointments
                  </p>
                </div>
                <Switch
                  checked={emailReminders}
                  onCheckedChange={setEmailReminders}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    SMS Reminders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive text message reminders
                  </p>
                </div>
                <Switch
                  checked={smsReminders}
                  onCheckedChange={setSmsReminders}
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          {user?.role === "DOCTOR" && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" /> Scheduling
              </h2>
              <div>
                <Label className="text-xs">Default Slot Duration (minutes)</Label>
                <div className="mt-2 flex gap-2">
                  {["30", "45", "60", "90"].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSlotDuration(dur)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        slotDuration === dur
                          ? "border-primary bg-primary text-primary-foreground shadow-button"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {dur} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" /> Privacy & Permissions
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Location Access
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Allow location for nearby medical store search
                  </p>
                </div>
                <Switch
                  checked={locationAccess}
                  onCheckedChange={setLocationAccess}
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                <Lock className="mr-1 h-4 w-4" /> Change Password
              </Button>
            </div>
          </div>

          {/* Save */}
          <Button onClick={handleSave} variant="hero" size="xl" className="w-full">
            <Save className="mr-2 h-4 w-4" /> Save All Settings
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
