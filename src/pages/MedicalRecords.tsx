import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Pill, Calendar, User, AlertCircle } from "lucide-react";

const MedicalRecords = () => {
  const { user, prescriptions } = useAuth();

  const myPrescriptions = prescriptions
    .filter((p) => p.patientId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" /> Medical Records
          </h1>
          <p className="mt-1 text-muted-foreground">
            View your prescriptions and medical history
          </p>
        </div>

        {myPrescriptions.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-semibold text-lg">No medical records yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your prescriptions will appear here after doctor consultations
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {myPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {rx.diagnosis}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {rx.doctorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(rx.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    Prescription
                  </span>
                </div>

                {rx.medicines.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <Pill className="h-4 w-4 text-primary" /> Medicines
                    </h4>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-secondary/50">
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Medicine</th>
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Dosage</th>
                            <th className="text-left px-4 py-2 font-medium text-muted-foreground">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rx.medicines.map((med, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-4 py-2 text-foreground font-medium">{med.name}</td>
                              <td className="px-4 py-2 text-muted-foreground">{med.dosage}</td>
                              <td className="px-4 py-2 text-muted-foreground">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {rx.notes && (
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Doctor's Notes</p>
                    <p className="text-sm text-foreground">{rx.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MedicalRecords;
