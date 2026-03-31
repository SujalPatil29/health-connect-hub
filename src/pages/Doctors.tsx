import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorCard from "@/components/DoctorCard";
import { doctors, specializations } from "@/data/doctors";

const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState("All");

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase()) ||
        d.hospital.toLowerCase().includes(search.toLowerCase());
      const matchesSpec =
        activeSpec === "All" || d.specialization === activeSpec;
      return matchesSearch && matchesSpec;
    });
  }, [search, activeSpec]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Find a Doctor
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse our network of verified healthcare professionals
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveSpec(spec)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeSpec === spec
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-foreground">No doctors found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
