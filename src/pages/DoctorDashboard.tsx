import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, Prescription } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Stethoscope,
  Save,
  Video,
  Plus,
  X,
  FileText,
  Pill,
} from "lucide-react";
import { toast } from "sonner";

const DoctorDashboard = () => {
  const { user, appointments, doctorProfiles, addDoctorProfile, completeAppointment, cancelAppointment, addPrescription, prescriptions } = useAuth();

  const profile = doctorProfiles.find((p) => p.userId === user?.id);
  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const upcoming = myAppointments.filter((a) => a.status === "BOOKED");
  const completed = myAppointments.filter((a) => a.status === "COMPLETED");

  const [editMode, setEditMode] = useState(!profile?.specialization);
  const [form, setForm] = useState({
    specialization: profile?.specialization || "",
    experience: profile?.experience?.toString() || "",
    fees: profile?.fees?.toString() || "",
    education: profile?.education || "",
    hospital: profile?.hospital || "",
  });

  const handleSaveProfile = () => {
    if (!user) return;
    addDoctorProfile({
      userId: user.id,
      specialization: form.specialization,
      experience: parseInt(form.experience) || 0,
      fees: parseFloat(form.fees) || 0,
      verified: profile?.verified || false,
      education: form.education,
      hospital: form.hospital,
    });
    setEditMode(false);
    toast.success("Profile updated!");
  };

  const totalEarnings = completed.reduce((sum, a) => sum + a.fees, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Doctor Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          {profile && !profile.verified && (
            <div className="rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm">
              <span className="flex items-center gap-2 text-accent-foreground font-medium">
                <AlertCircle className="h-4 w-4" /> Pending Verification
              </span>
            </div>
          )}
          {profile?.verified && (
            <div className="rounded-lg border border-primary/30 bg-secondary px-4 py-2 text-sm">
              <span className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle className="h-4 w-4" /> Verified Doctor
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Patients", value: myAppointments.length, icon: Users, color: "text-primary" },
            { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-blue-500" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-500" },
            { label: "Earnings", value: `₹${totalEarnings}`, icon: DollarSign, color: "text-accent-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" /> My Profile
                </h2>
                {!editMode && (
                  <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Specialization</Label>
                    <Input
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      placeholder="e.g. Cardiologist"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Experience (years)</Label>
                    <Input
                      type="number"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Consultation Fee ($)</Label>
                    <Input
                      type="number"
                      value={form.fees}
                      onChange={(e) => setForm({ ...form, fees: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Education</Label>
                    <Input
                      value={form.education}
                      onChange={(e) => setForm({ ...form, education: e.target.value })}
                      placeholder="e.g. MD - Harvard"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hospital</Label>
                    <Input
                      value={form.hospital}
                      onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                      placeholder="e.g. City Hospital"
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full mt-2">
                    <Save className="mr-2 h-4 w-4" /> Save Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Specialization</span>
                    <span className="font-medium text-foreground">{profile?.specialization || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium text-foreground">{profile?.experience || 0} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-foreground">₹{profile?.fees || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Education</span>
                    <span className="font-medium text-foreground">{profile?.education || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital</span>
                    <span className="font-medium text-foreground">{profile?.hospital || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slot Management */}
          <div className="lg:col-span-2">
            <SlotManager />
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Appointments
              </h2>

              {myAppointments.length === 0 ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium">No appointments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.verified
                      ? "Patients will book with you once your profile is complete"
                      : "Complete your profile and wait for admin verification"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myAppointments
                    .sort((a, b) => {
                      const order = { BOOKED: 0, COMPLETED: 1, CANCELLED: 2 };
                      return order[a.status] - order[b.status];
                    })
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm">{apt.patientName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(apt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {apt.timeSlot}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {apt.status === "BOOKED" && (
                            <>
                              <Link to={`/consultation/${apt.id}`}>
                                <Button size="sm" variant="secondary">
                                  <Video className="mr-1 h-3 w-3" /> Join
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                onClick={() => completeAppointment(apt.id)}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" /> Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelAppointment(apt.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {apt.status === "COMPLETED" && (
                            <div className="flex items-center gap-2">
                              {!prescriptions.find((p) => p.appointmentId === apt.id) ? (
                                <PrescriptionForm
                                  appointmentId={apt.id}
                                  doctorId={user?.id || ""}
                                  doctorName={user?.name || ""}
                                  patientId={apt.patientId}
                                  patientName={apt.patientName}
                                  date={apt.date}
                                  onSubmit={addPrescription}
                                />
                              ) : (
                                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium flex items-center gap-1">
                                  <FileText className="h-3 w-3" /> Rx Added
                                </span>
                              )}
                              <span className="rounded-full bg-green-50 border border-green-200 text-green-700 px-2.5 py-0.5 text-xs font-medium">
                                Completed
                              </span>
                            </div>
                          )}
                          {apt.status === "CANCELLED" && (
                            <span className="rounded-full bg-red-50 border border-red-200 text-red-700 px-2.5 py-0.5 text-xs font-medium">
                              Cancelled
                            </span>
                          )}
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

const defaultSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];

const SlotManager = () => {
  const [slots, setSlots] = useState<string[]>(defaultSlots);
  const [newSlot, setNewSlot] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const addSlot = () => {
    if (!newSlot.trim()) return;
    if (slots.includes(newSlot.trim())) {
      toast.error("Slot already exists");
      return;
    }
    setSlots((prev) => [...prev, newSlot.trim()].sort());
    setNewSlot("");
    setShowAdd(false);
    toast.success("Slot added");
  };

  const removeSlot = (slot: string) => {
    setSlots((prev) => prev.filter((s) => s !== slot));
    toast.success("Slot removed");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Available Slots
        </h2>
        <Button
          size="sm"
          variant={showAdd ? "outline" : "default"}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? <><X className="mr-1 h-3 w-3" /> Cancel</> : <><Plus className="mr-1 h-3 w-3" /> Add Slot</>}
        </Button>
      </div>

      {showAdd && (
        <div className="mb-4 flex gap-2">
          <Input
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="e.g. 06:00 PM"
            className="max-w-xs"
          />
          <Button size="sm" onClick={addSlot}>Add</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <div
            key={slot}
            className="group inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
          >
            {slot}
            <button
              onClick={() => removeSlot(slot)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {slots.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No slots configured. Add slots for patients to book.
        </p>
      )}
    </div>
  );
};

interface PrescriptionFormProps {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  onSubmit: (prescription: Omit<Prescription, "id">) => void;
}

const PrescriptionForm = ({ appointmentId, doctorId, doctorName, patientId, patientName, date, onSubmit }: PrescriptionFormProps) => {
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);

  const addMedicine = () => setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }]);
  const removeMedicine = (i: number) => setMedicines((prev) => prev.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, field: string, value: string) => {
    setMedicines((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = () => {
    if (!diagnosis.trim()) { toast.error("Please enter a diagnosis"); return; }
    if (medicines.some((m) => !m.name.trim())) { toast.error("Please fill medicine names"); return; }
    onSubmit({ appointmentId, doctorId, doctorName, patientId, patientName, date, diagnosis, medicines: medicines.filter((m) => m.name.trim()), notes });
    setOpen(false);
    toast.success("Prescription added!");
  };

  if (!open) {
    return (
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <FileText className="mr-1 h-3 w-3" /> Add Rx
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Write Prescription
          </h3>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Patient: <span className="font-medium text-foreground">{patientName}</span></p>

        <div className="space-y-4">
          <div>
            <Label className="text-xs">Diagnosis</Label>
            <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Viral Fever" className="mt-1" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs flex items-center gap-1"><Pill className="h-3.5 w-3.5" /> Medicines</Label>
              <Button size="sm" variant="ghost" onClick={addMedicine}><Plus className="h-3 w-3 mr-1" /> Add</Button>
            </div>
            {medicines.map((med, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input placeholder="Medicine" value={med.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} className="flex-1" />
                <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} className="w-28" />
                <Input placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} className="w-28" />
                {medicines.length > 1 && (
                  <button onClick={() => removeMedicine(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                )}
              </div>
            ))}
          </div>

          <div>
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional advice..." className="mt-1" rows={3} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} className="flex-1"><Save className="mr-2 h-4 w-4" /> Save Prescription</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
