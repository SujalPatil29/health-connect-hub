import { useState } from "react";
import { useAuth, DoctorDocument } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const REQUIRED_DOCUMENTS: { type: DoctorDocument["type"]; label: string; description: string }[] = [
  { type: "medical_license", label: "Medical License (MCI/NMC Registration)", description: "Valid medical council registration certificate" },
  { type: "degree_certificate", label: "Degree Certificate (MBBS/MD/MS)", description: "Medical degree from a recognized institution" },
  { type: "id_proof", label: "Government ID Proof", description: "Aadhaar Card, PAN Card, or Passport" },
  { type: "experience_letter", label: "Experience Letter / Hospital Affiliation", description: "Letter from current or previous hospital" },
];

const DoctorDocumentUpload = () => {
  const { user, doctorDocuments, submitDocument } = useAuth();
  const myDocs = doctorDocuments.filter((d) => d.doctorId === user?.id);

  const getDocStatus = (type: DoctorDocument["type"]) =>
    myDocs.find((d) => d.type === type);

  const allApproved = REQUIRED_DOCUMENTS.every(
    (req) => getDocStatus(req.type)?.status === "APPROVED"
  );
  const pendingCount = REQUIRED_DOCUMENTS.filter(
    (req) => getDocStatus(req.type)?.status === "PENDING"
  ).length;
  const rejectedCount = REQUIRED_DOCUMENTS.filter(
    (req) => getDocStatus(req.type)?.status === "REJECTED"
  ).length;
  const submittedCount = myDocs.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Document Verification
        </h2>
        {allApproved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 text-green-700 px-2.5 py-0.5 text-xs font-medium">
            <CheckCircle className="h-3 w-3" /> All Verified
          </span>
        )}
      </div>

      {!allApproved && (
        <div className="mb-4 rounded-lg bg-accent/10 border border-accent/30 p-3 text-sm text-accent-foreground flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>Submit all required documents for admin verification. Your profile will be verified once all documents are approved.</p>
        </div>
      )}

      {/* Progress summary */}
      <div className="mb-4 flex gap-3 text-xs">
        <span className="text-muted-foreground">{submittedCount}/{REQUIRED_DOCUMENTS.length} submitted</span>
        {pendingCount > 0 && <span className="text-amber-600">{pendingCount} pending</span>}
        {rejectedCount > 0 && <span className="text-destructive">{rejectedCount} rejected</span>}
      </div>

      <div className="space-y-3">
        {REQUIRED_DOCUMENTS.map((req) => {
          const doc = getDocStatus(req.type);
          return (
            <DocumentRow
              key={req.type}
              type={req.type}
              label={req.label}
              description={req.description}
              doc={doc}
              doctorId={user?.id || ""}
              onSubmit={submitDocument}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DocumentRowProps {
  type: DoctorDocument["type"];
  label: string;
  description: string;
  doc?: DoctorDocument;
  doctorId: string;
  onSubmit: (doc: Omit<DoctorDocument, "id" | "status" | "submittedAt">) => void;
}

const DocumentRow = ({ type, label, description, doc, doctorId, onSubmit }: DocumentRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, JPG, or PNG file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    onSubmit({
      doctorId,
      name: label,
      type,
      fileName: selectedFile.name,
    });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success(`${label} submitted for review!`);
  };

  const statusIcon = {
    PENDING: <Clock className="h-4 w-4 text-amber-500" />,
    APPROVED: <CheckCircle className="h-4 w-4 text-green-500" />,
    REJECTED: <XCircle className="h-4 w-4 text-destructive" />,
  };

  const statusBadge = {
    PENDING: "bg-amber-50 border-amber-200 text-amber-700",
    APPROVED: "bg-green-50 border-green-200 text-green-700",
    REJECTED: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <h4 className="font-medium text-foreground text-sm">{label}</h4>
            {doc && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge[doc.status]}`}>
                {statusIcon[doc.status]}
                {doc.status}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-6">{description}</p>
          {doc?.status === "REJECTED" && doc.rejectionReason && (
            <p className="text-xs text-destructive mt-1 ml-6">
              Reason: {doc.rejectionReason}
            </p>
          )}
          {doc && (
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              File: {doc.fileName} · Submitted {new Date(doc.submittedAt).toLocaleDateString("en-IN")}
            </p>
          )}
        </div>
      </div>

      {(!doc || doc.status === "REJECTED") && (
        <div className="mt-3 ml-6 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id={`file-${type}`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm"
          >
            <Upload className="mr-1 h-3 w-3" />
            {selectedFile ? selectedFile.name : "Choose File"}
          </Button>
          {selectedFile && (
            <Button size="sm" onClick={handleUpload}>
              {doc?.status === "REJECTED" ? "Resubmit" : "Submit"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDocumentUpload;
