import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorImage: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  status: "BOOKED" | "COMPLETED" | "CANCELLED";
  fees: number;
}

export interface DoctorProfile {
  userId: string;
  specialization: string;
  experience: number;
  fees: number;
  verified: boolean;
  education: string;
  hospital: string;
}

interface AuthContextType {
  user: User | null;
  appointments: Appointment[];
  doctorProfiles: DoctorProfile[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  addDoctorProfile: (profile: DoctorProfile) => void;
  verifyDoctor: (userId: string) => void;
  rejectDoctor: (userId: string) => void;
  getAllUsers: () => User[];
  getDoctorProfiles: () => DoctorProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "medibook_users";
const CURRENT_USER_KEY = "medibook_current_user";
const APPOINTMENTS_KEY = "medibook_appointments";
const DOCTOR_PROFILES_KEY = "medibook_doctor_profiles";

// Seed data
const seedUsers: (User & { password: string })[] = [
  { id: "admin-1", name: "Admin User", email: "admin@medibook.com", password: "admin123", role: "ADMIN" },
  { id: "patient-1", name: "John Doe", email: "patient@medibook.com", password: "patient123", role: "PATIENT" },
  { id: "doctor-1", name: "Dr. Sarah Mitchell", email: "doctor@medibook.com", password: "doctor123", role: "DOCTOR" },
];

const seedDoctorProfiles: DoctorProfile[] = [
  { userId: "doctor-1", specialization: "Cardiologist", experience: 12, fees: 800, verified: true, education: "MD, FACC - Johns Hopkins", hospital: "City Heart Center" },
];

const seedAppointments: Appointment[] = [
  {
    id: "apt-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialization: "Cardiologist",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    patientId: "patient-1",
    patientName: "John Doe",
    patientEmail: "patient@medibook.com",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    timeSlot: "10:00 AM",
    status: "BOOKED",
    fees: 800,
  },
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<(User & { password: string })[]>(() =>
    getStored(USERS_KEY, seedUsers)
  );
  const [user, setUser] = useState<User | null>(() =>
    getStored(CURRENT_USER_KEY, null)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getStored(APPOINTMENTS_KEY, seedAppointments)
  );
  const [doctorProfiles, setDoctorProfiles] = useState<DoctorProfile[]>(() =>
    getStored(DOCTOR_PROFILES_KEY, seedDoctorProfiles)
  );

  useEffect(() => localStorage.setItem(USERS_KEY, JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem(DOCTOR_PROFILES_KEY, JSON.stringify(doctorProfiles)), [doctorProfiles]);

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password" };
    const { password: _, ...userData } = found;
    setUser(userData);
    return { success: true };
  };

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }
    const newUser = { id: crypto.randomUUID(), name, email, password, role };
    setUsers((prev) => [...prev, newUser]);
    const { password: _, ...userData } = newUser;
    setUser(userData);

    if (role === "DOCTOR") {
      setDoctorProfiles((prev) => [
        ...prev,
        { userId: newUser.id, specialization: "", experience: 0, fees: 0, verified: false, education: "", hospital: "" },
      ]);
    }
    return { success: true };
  };

  const logout = () => setUser(null);

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    setAppointments((prev) => [...prev, { ...appointment, id: crypto.randomUUID() }]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" as const } : a))
    );
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "COMPLETED" as const } : a))
    );
  };

  const addDoctorProfile = (profile: DoctorProfile) => {
    setDoctorProfiles((prev) => {
      const existing = prev.findIndex((p) => p.userId === profile.userId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = profile;
        return updated;
      }
      return [...prev, profile];
    });
  };

  const verifyDoctor = (userId: string) => {
    setDoctorProfiles((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, verified: true } : p))
    );
  };

  const rejectDoctor = (userId: string) => {
    setDoctorProfiles((prev) => prev.filter((p) => p.userId !== userId));
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const getAllUsers = () => users.map(({ password: _, ...u }) => u);
  const getDoctorProfiles = () => doctorProfiles;

  return (
    <AuthContext.Provider
      value={{
        user,
        appointments,
        doctorProfiles,
        login,
        signup,
        logout,
        addAppointment,
        cancelAppointment,
        completeAppointment,
        addDoctorProfile,
        verifyDoctor,
        rejectDoctor,
        getAllUsers,
        getDoctorProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
