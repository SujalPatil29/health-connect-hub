export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  fees: number;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  nextAvailable: string;
  education: string;
  hospital: string;
}

export const specializations = [
  "All",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Psychiatrist",
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialization: "Cardiologist",
    experience: 12,
    fees: 800,
    rating: 4.9,
    reviews: 328,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today",
    education: "MD, FACC - Johns Hopkins",
    hospital: "City Heart Center",
  },
  {
    id: "2",
    name: "Dr. James Chen",
    specialization: "Dermatologist",
    experience: 8,
    fees: 120,
    rating: 4.8,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today",
    education: "MD, FAAD - Stanford",
    hospital: "SkinCare Clinic",
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    experience: 15,
    fees: 100,
    rating: 4.9,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Tomorrow",
    education: "MD, FAAP - Harvard",
    hospital: "Children's Medical Center",
  },
  {
    id: "4",
    name: "Dr. Michael Roberts",
    specialization: "Orthopedic",
    experience: 20,
    fees: 200,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    available: false,
    nextAvailable: "Mon, Dec 2",
    education: "MD, FAAOS - Mayo Clinic",
    hospital: "Ortho Specialty Hospital",
  },
  {
    id: "5",
    name: "Dr. Emily Watson",
    specialization: "Neurologist",
    experience: 10,
    fees: 180,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today",
    education: "MD, PhD - Columbia",
    hospital: "Neuro Care Institute",
  },
  {
    id: "6",
    name: "Dr. Raj Patel",
    specialization: "General Physician",
    experience: 18,
    fees: 80,
    rating: 4.6,
    reviews: 534,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today",
    education: "MBBS, MD - AIIMS",
    hospital: "HealthFirst Clinic",
  },
  {
    id: "7",
    name: "Dr. Lisa Park",
    specialization: "Gynecologist",
    experience: 14,
    fees: 160,
    rating: 4.9,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Tomorrow",
    education: "MD, FACOG - UCLA",
    hospital: "Women's Health Center",
  },
  {
    id: "8",
    name: "Dr. David Kim",
    specialization: "ENT Specialist",
    experience: 9,
    fees: 130,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today",
    education: "MD - University of Chicago",
    hospital: "ENT Care Hospital",
  },
];

export const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];
