import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Video,
  ShieldCheck,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorCard from "@/components/DoctorCard";
import { doctors, specializations } from "@/data/doctors";

const features = [
  {
    icon: Search,
    title: "Find Doctors",
    description: "Search by specialization, location, and availability",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book appointments in seconds with real-time slot availability",
  },
  {
    icon: Video,
    title: "Video Consult",
    description: "Connect with doctors via secure video consultations",
  },
  {
    icon: ShieldCheck,
    title: "Verified Doctors",
    description: "All doctors are verified and credentialed professionals",
  },
];

const specialtyIcons = [
  { icon: Heart, label: "Cardiology", color: "text-red-500" },
  { icon: Brain, label: "Neurology", color: "text-purple-500" },
  { icon: Bone, label: "Orthopedics", color: "text-orange-500" },
  { icon: Baby, label: "Pediatrics", color: "text-pink-500" },
  { icon: Stethoscope, label: "General", color: "text-primary" },
  { icon: Eye, label: "Eye Care", color: "text-blue-500" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const Index = () => {
  const topDoctors = doctors.filter((d) => d.rating >= 4.8).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero-gradient">
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Your Health,{" "}
              <span className="text-gradient-primary">Our Priority</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
            >
              Book appointments with top doctors, consult online, and manage your healthcare journey — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/doctors">
                <Button variant="hero" size="xl">
                  Find a Doctor
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl">
                Video Consultation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> 500+ Verified Doctors
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> 50k+ Appointments
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" /> 4.9 Average Rating
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Simple steps to get the care you need
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className="bg-muted/40 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Browse by Specialization
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the right specialist for your needs
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {specialtyIcons.map((spec, i) => (
              <motion.div
                key={spec.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to="/doctors"
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <spec.icon className={`h-6 w-6 ${spec.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {spec.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Top Rated Doctors
            </h2>
            <p className="mt-1 text-muted-foreground">
              Trusted by thousands of patients
            </p>
          </div>
          <Link to="/doctors">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">
            Ready to Take Control of Your Health?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
            Join thousands of patients who trust MediBook for their healthcare needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/doctors">
              <Button variant="secondary" size="xl">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Import Star here for the stats section
import { Star } from "lucide-react";

export default Index;
