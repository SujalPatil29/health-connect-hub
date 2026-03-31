import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  FileText,
  Save,
  Plus,
  X,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface MedicalRecord {
  id: string;
  date: string;
  condition: string;
  doctor: string;
  notes: string;
}

const PatientProfile = () => {
  const { user } = useAuth();

  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      date: "2025-11-15",
      condition: "Annual Physical Checkup",
      doctor: "Dr. Raj Patel",
      notes: "All vitals normal. Recommended regular exercise.",
    },
    {
      id: "2",
      date: "2025-09-03",
      condition: "Seasonal Allergies",
      doctor: "Dr. Sarah Mitchell",
      notes: "Prescribed antihistamines. Follow-up in 2 weeks.",
    },
  ]);

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    condition: "",
    doctor: "",
    notes: "",
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleAddRecord = () => {
    if (!newRecord.condition.trim()) {
      toast.error("Please enter a condition");
      return;
    }
    setRecords((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        condition: newRecord.condition,
        doctor: newRecord.doctor,
        notes: newRecord.notes,
      },
      ...prev,
    ]);
    setNewRecord({ condition: "", doctor: "", notes: "" });
    setShowAddRecord(false);
    toast.success("Medical record added");
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success("Record removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your personal and medical information
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Personal Info */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" /> Personal Info
              </h2>

              <div className="flex flex-col items-center mb-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="mt-1 rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                  {user?.role}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Blood Type</Label>
                  <Input
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    placeholder="e.g. O+"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Allergies</Label>
                  <Input
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Emergency Contact</Label>
                  <Input
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Medical History Notes</Label>
                  <Textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder="Any conditions, surgeries, or ongoing treatments..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Medical Records
                </h2>
                <Button
                  size="sm"
                  variant={showAddRecord ? "outline" : "default"}
                  onClick={() => setShowAddRecord(!showAddRecord)}
                >
                  {showAddRecord ? (
                    <>
                      <X className="mr-1 h-3 w-3" /> Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1 h-3 w-3" /> Add Record
                    </>
                  )}
                </Button>
              </div>

              {/* Add Record Form */}
              {showAddRecord && (
                <div className="mb-5 rounded-lg border border-primary/20 bg-secondary/50 p-4">
                  <h4 className="font-medium text-foreground text-sm mb-3">
                    New Medical Record
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Condition / Procedure</Label>
                      <Input
                        value={newRecord.condition}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, condition: e.target.value })
                        }
                        placeholder="e.g. Blood Pressure Check"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Doctor</Label>
                      <Input
                        value={newRecord.doctor}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, doctor: e.target.value })
                        }
                        placeholder="e.g. Dr. Smith"
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Notes</Label>
                      <Textarea
                        value={newRecord.notes}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, notes: e.target.value })
                        }
                        placeholder="Additional notes..."
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddRecord} size="sm" className="mt-3">
                    <Save className="mr-1 h-3 w-3" /> Save Record
                  </Button>
                </div>
              )}

              {/* Records List */}
              {records.length === 0 ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium">No medical records</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your medical history for better care
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {record.condition}
                          </h4>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(record.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {record.doctor && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {record.doctor}
                              </span>
                            )}
                          </div>
                          {record.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {record.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeRecord(record.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientProfile;
