import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Stethoscope,
  AlertCircle,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const {
    user,
    appointments,
    getAllUsers,
    getDoctorProfiles,
    verifyDoctor,
    rejectDoctor,
    doctorDocuments,
    approveDocument,
    rejectDocument,
  } = useAuth();

  const allUsers = getAllUsers();
  const profiles = getDoctorProfiles();
  const patients = allUsers.filter((u) => u.role === "PATIENT");
  const doctors = allUsers.filter((u) => u.role === "DOCTOR");
  const pendingDoctors = profiles.filter((p) => !p.verified);
  const verifiedDoctors = profiles.filter((p) => p.verified);
  const pendingDocs = doctorDocuments.filter((d) => d.status === "PENDING");

  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleVerify = (userId: string) => {
    verifyDoctor(userId);
    toast.success("Doctor verified successfully!");
  };

  const handleReject = (userId: string) => {
    rejectDoctor(userId);
    toast.success("Doctor rejected and removed");
  };

  const handleApproveDoc = (docId: string) => {
    approveDocument(docId);
    toast.success("Document approved!");
  };

  const handleRejectDoc = (docId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectDocument(docId, rejectReason);
    setRejectingDocId(null);
    setRejectReason("");
    toast.success("Document rejected");
  };

  const getDoctorUser = (userId: string) => allUsers.find((u) => u.id === userId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" /> Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">Manage users, doctors, and system operations</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-6">
          {[
            { label: "Total Users", value: allUsers.length, icon: Users, color: "text-primary" },
            { label: "Patients", value: patients.length, icon: Users, color: "text-blue-500" },
            { label: "Doctors", value: doctors.length, icon: Stethoscope, color: "text-green-500" },
            { label: "Pending", value: pendingDoctors.length, icon: Clock, color: "text-accent-foreground" },
            { label: "Pending Docs", value: pendingDocs.length, icon: FileText, color: "text-amber-500" },
            { label: "Appointments", value: appointments.length, icon: Calendar, color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Document Verification */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" /> Document Review
              {pendingDocs.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 border border-amber-300 text-amber-700 px-2 py-0.5 text-xs font-medium">
                  {pendingDocs.length} pending
                </span>
              )}
            </h2>

            {pendingDocs.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-3" />
                <p className="text-foreground font-medium">No documents to review</p>
                <p className="text-sm text-muted-foreground mt-1">All submitted documents have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDocs.map((doc) => {
                  const docUser = getDoctorUser(doc.doctorId);
                  return (
                    <div key={doc.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <h4 className="font-medium text-foreground text-sm">{doc.name}</h4>
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                              {doc.type.replace(/_/g, " ")}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 ml-6">
                            Doctor: <span className="font-medium text-foreground">{docUser?.name || "Unknown"}</span> · {docUser?.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                            File: {doc.fileName} · Submitted {new Date(doc.submittedAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {rejectingDocId === doc.id ? (
                        <div className="mt-3 ml-6 flex items-center gap-2">
                          <Input
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="max-w-xs text-sm"
                          />
                          <Button size="sm" variant="destructive" onClick={() => handleRejectDoc(doc.id)}>
                            Confirm Reject
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setRejectingDocId(null); setRejectReason(""); }}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-3 ml-6 flex gap-2">
                          <Button size="sm" onClick={() => handleApproveDoc(doc.id)}>
                            <ThumbsUp className="mr-1 h-3 w-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setRejectingDocId(doc.id)}
                          >
                            <ThumbsDown className="mr-1 h-3 w-3" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recently reviewed documents */}
            {doctorDocuments.filter((d) => d.status !== "PENDING").length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Recently Reviewed</h3>
                <div className="space-y-2">
                  {doctorDocuments
                    .filter((d) => d.status !== "PENDING")
                    .slice(-5)
                    .reverse()
                    .map((doc) => {
                      const docUser = getDoctorUser(doc.doctorId);
                      return (
                        <div key={doc.id} className="flex items-center gap-3 text-sm">
                          {doc.status === "APPROVED" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive shrink-0" />
                          )}
                          <span className="text-foreground">{doc.name}</span>
                          <span className="text-muted-foreground">— {docUser?.name}</span>
                          <span className={`ml-auto text-xs font-medium ${doc.status === "APPROVED" ? "text-green-600" : "text-destructive"}`}>
                            {doc.status}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Pending Verifications */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" /> Pending Verifications
            </h2>

            {pendingDoctors.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-3" />
                <p className="text-foreground font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground mt-1">No pending doctor verifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDoctors.map((profile) => {
                  const docUser = getDoctorUser(profile.userId);
                  const docDocs = doctorDocuments.filter((d) => d.doctorId === profile.userId);
                  const approvedDocs = docDocs.filter((d) => d.status === "APPROVED").length;
                  const totalRequired = 4;
                  return (
                    <div key={profile.userId} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{docUser?.name || "Unknown"}</h4>
                          <p className="text-sm text-muted-foreground">{docUser?.email}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {profile.specialization && (
                              <span className="rounded bg-secondary px-2 py-0.5">{profile.specialization}</span>
                            )}
                            {profile.experience > 0 && (
                              <span className="rounded bg-secondary px-2 py-0.5">{profile.experience} yrs exp</span>
                            )}
                            {profile.hospital && (
                              <span className="rounded bg-secondary px-2 py-0.5">{profile.hospital}</span>
                            )}
                          </div>
                          <p className="mt-2 text-xs">
                            <span className={approvedDocs >= totalRequired ? "text-green-600 font-medium" : "text-amber-600"}>
                              Documents: {approvedDocs}/{totalRequired} approved
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={() => handleVerify(profile.userId)} disabled={approvedDocs < totalRequired}>
                          <UserCheck className="mr-1 h-3 w-3" /> Verify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(profile.userId)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <UserX className="mr-1 h-3 w-3" /> Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verified Doctors */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" /> Verified Doctors
            </h2>

            {verifiedDoctors.length === 0 ? (
              <div className="py-8 text-center">
                <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-foreground font-medium">No verified doctors yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {verifiedDoctors.map((profile) => {
                  const docUser = getDoctorUser(profile.userId);
                  const doctorAppts = appointments.filter((a) => a.doctorId === profile.userId);
                  return (
                    <div
                      key={profile.userId}
                      className="flex items-center gap-3 rounded-lg border border-border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm">{docUser?.name || "Unknown"}</h4>
                        <p className="text-xs text-muted-foreground">
                          {profile.specialization} · {profile.experience} yrs · ₹{profile.fees}/visit
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {doctorAppts.length} appts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> All Appointments
            </h2>

            {appointments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No appointments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Patient</th>
                      <th className="pb-3 font-medium text-muted-foreground">Doctor</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Time</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((apt) => (
                        <tr key={apt.id} className="border-b border-border last:border-0">
                          <td className="py-3 text-foreground">{apt.patientName}</td>
                          <td className="py-3 text-foreground">{apt.doctorName}</td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 text-muted-foreground">{apt.timeSlot}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                                apt.status === "BOOKED"
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : apt.status === "COMPLETED"
                                  ? "bg-green-50 border-green-200 text-green-700"
                                  : "bg-red-50 border-red-200 text-red-700"
                              }`}
                            >
                              {apt.status === "BOOKED" && <Clock className="h-3 w-3" />}
                              {apt.status === "COMPLETED" && <CheckCircle className="h-3 w-3" />}
                              {apt.status === "CANCELLED" && <XCircle className="h-3 w-3" />}
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-foreground">₹{apt.fees}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
