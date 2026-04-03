import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
      <div className="flex gap-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-20 w-20 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground truncate">
            {doctor.name}
          </h3>
          <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{doctor.education}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-1 text-accent-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          {doctor.rating}
          <span className="text-muted-foreground">({doctor.reviews})</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {doctor.experience} yrs
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {doctor.hospital}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-foreground">₹{doctor.fees}</span>
          <span className="text-xs text-muted-foreground ml-1">/ visit</span>
        </div>
        <div className="flex items-center gap-2">
          {doctor.available && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {doctor.nextAvailable}
            </span>
          )}
          <Link to={`/book/${doctor.id}`}>
            <Button size="sm" variant={doctor.available ? "default" : "outline"}>
              {doctor.available ? "Book Now" : "View"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
