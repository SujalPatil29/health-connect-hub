import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, MapPin, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doctors, timeSlots } from "@/data/doctors";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const BookAppointment = () => {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-lg text-foreground">Doctor not found</p>
          <Link to="/doctors">
            <Button variant="outline" className="mt-4">
              Back to Doctors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user, addAppointment } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!date || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    if (!user) {
      toast.error("Please log in to book an appointment");
      navigate("/login");
      return;
    }
    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorImage: doctor.image,
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email,
      date: date.toISOString().split("T")[0],
      timeSlot: selectedSlot,
      status: "BOOKED",
      fees: doctor.fees,
    });
    setBooked(true);
    toast.success("Appointment booked successfully!");
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Booking Confirmed!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your appointment with {doctor.name} is confirmed.
            </p>
            <div className="mt-6 rounded-lg bg-muted p-4 text-left text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">{doctor.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {date?.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{selectedSlot}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium text-foreground">${doctor.fees}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Link to="/doctors" className="flex-1">
                <Button variant="outline" className="w-full">
                  Find More Doctors
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full">Go Home</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <Link
          to="/doctors"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Doctors
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="mx-auto h-28 w-28 rounded-xl object-cover"
              />
              <div className="mt-4 text-center">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {doctor.name}
                </h2>
                <p className="text-sm font-medium text-primary">
                  {doctor.specialization}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{doctor.education}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.hospital}</span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-secondary p-3 text-center">
                <span className="text-sm text-muted-foreground">Consultation Fee</span>
                <p className="text-2xl font-bold text-foreground">${doctor.fees}</p>
              </div>
            </div>
          </div>

          {/* Booking */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Select Date
              </h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className="pointer-events-auto"
              />
            </div>

            {date && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        selectedSlot === slot
                          ? "border-primary bg-primary text-primary-foreground shadow-button"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {date && selectedSlot && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  Booking Summary
                </h3>
                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-medium text-foreground">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-foreground">${doctor.fees}</span>
                  </div>
                </div>
                <Button
                  variant="hero"
                  size="xl"
                  className="mt-4 w-full"
                  onClick={handleBook}
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointment;
