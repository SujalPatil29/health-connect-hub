import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Filter,
  Pill,
  Eye,
  FlaskConical,
  HeartPulse,
  Wrench,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchNearbyStores, type RealMedicalStore } from "@/lib/overpassApi";
import { motion } from "framer-motion";

const categories = ["All", "Pharmacy", "Medical Equipment", "Optical", "Lab & Diagnostics", "Wellness"];

const categoryIcons: Record<string, React.ElementType> = {
  Pharmacy: Pill,
  "Medical Equipment": Wrench,
  Optical: Eye,
  "Lab & Diagnostics": FlaskConical,
  Wellness: HeartPulse,
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

const MedicalStores = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [stores, setStores] = useState<RealMedicalStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [located, setLocated] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported by your browser");
      return;
    }
    setLoading(true);
    setLocationStatus("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationStatus("Fetching nearby medical stores...");
        try {
          const result = await fetchNearbyStores(latitude, longitude, 5);
          setStores(result);
          setLocated(true);
          setLocationStatus(
            result.length > 0
              ? `Found ${result.length} medical stores near you`
              : "No medical stores found nearby. Try increasing the radius."
          );
        } catch {
          setLocationStatus("Failed to fetch stores. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationStatus("Location permission denied. Please enable it in browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationStatus("Location unavailable. Try again later.");
            break;
          default:
            setLocationStatus("Could not get location. Try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-detect on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const filtered = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase()) ||
      store.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === "All" || store.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-2">
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Medical Stores Near You
          </h1>
          <p className="mt-1 text-muted-foreground">
            Real pharmacies, labs, optical & medical stores near your live location
          </p>
        </div>

        {/* Search & Location */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stores, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="w-fit" onClick={detectLocation} disabled={loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Navigation className="mr-1 h-4 w-4" />}
            {loading ? "Locating..." : "Refresh Location"}
          </Button>
        </div>

        {locationStatus && (
          <p className={`mt-2 text-sm ${located ? "text-green-600" : "text-muted-foreground"}`}>
            {locationStatus}
          </p>
        )}

        {/* Category Chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Filter;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat !== "All" && <Icon className="h-3.5 w-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">{locationStatus}</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && located && (
          <div className="mt-16 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-foreground">No stores found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const StoreCard = ({ store, index }: { store: RealMedicalStore; index: number }) => {
  const Icon = categoryIcons[store.category] || Stethoscope;

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`, "_blank");
  };

  const callStore = () => {
    if (store.phone !== "Not available") {
      window.open(`tel:${store.phone}`);
    }
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{store.name}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {store.category}
            </span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {store.distance}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{store.address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{store.hours}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{store.phone}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
        <span className="text-sm font-medium text-foreground">{store.rating}</span>
        <span className="text-xs text-muted-foreground">({store.reviews})</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {store.services.map((service) => (
          <span key={service} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {service}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="default" size="sm" className="flex-1" onClick={openDirections}>
          <Navigation className="mr-1 h-3 w-3" /> Directions
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={callStore} disabled={store.phone === "Not available"}>
          <Phone className="mr-1 h-3 w-3" /> Call
        </Button>
      </div>
    </motion.div>
  );
};

export default MedicalStores;
