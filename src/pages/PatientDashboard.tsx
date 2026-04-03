import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, XCircle, CheckCircle, AlertCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  BOOKED: { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock, label: "Upcoming" },
  COMPLETED: { bg: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle, label: "Completed" },
  CANCELLED: { bg: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Cancelled" },
};

const PatientDashboard = () => {
  const { user, appointments, cancelAppointment } = useAuth();

  const myAppointments = appointments
    .filter((a) => a.patientId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcoming = myAppointments.filter((a) => a.status === "BOOKED");
  const past = myAppointments.filter((a) => a.status !== "BOOKED");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-muted-foreground">Manage your appointments and health</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Appointments", value: myAppointments.length, icon: Calendar, color: "text-primary" },
            { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-blue-500" },
            { label: "Completed", value: myAppointments.filter((a) => a.status === "COMPLETED").length, icon: CheckCircle, color: "text-green-500" },
            { label: "Cancelled", value: myAppointments.filter((a) => a.status === "CANCELLED").length, icon: XCircle, color: "text-red-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <Link to="/doctors">
            <Button variant="hero" size="lg">
              <Calendar className="mr-2 h-4 w-4" /> Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Upcoming */}
        <div className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
            Upcoming Appointments
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-foreground font-medium">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground mt-1">Book an appointment with a doctor to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
                  <img src={apt.doctorImage} alt={apt.doctorName} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{apt.doctorName}</h3>
                    <p className="text-sm text-primary">{apt.doctorSpecialization}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(apt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">₹{apt.fees}</span>
                    <Link to={`/consultation/${apt.id}`}>
                      <Button size="sm" variant="secondary">
                        <Video className="mr-1 h-3 w-3" /> Join Call
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelAppointment(apt.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              Past Appointments
            </h2>
            <div className="space-y-3">
              {past.map((apt) => {
                const style = statusStyles[apt.status];
                return (
                  <div key={apt.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card opacity-80">
                    <img src={apt.doctorImage} alt={apt.doctorName} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{apt.doctorName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {apt.timeSlot}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.bg}`}>
                      <style.icon className="h-3 w-3" /> {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
