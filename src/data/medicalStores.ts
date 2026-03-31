export interface MedicalStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  hours: string;
  category: string;
  services: string[];
  latitude: number;
  longitude: number;
}

export const storeCategories = [
  "All",
  "Pharmacy",
  "Medical Equipment",
  "Optical",
  "Lab & Diagnostics",
  "Wellness",
];

export const medicalStores: MedicalStore[] = [
  {
    id: "s1",
    name: "HealthPlus Pharmacy",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    distance: "0.3 mi",
    rating: 4.8,
    reviews: 234,
    isOpen: true,
    hours: "8:00 AM - 10:00 PM",
    category: "Pharmacy",
    services: ["Prescriptions", "Vaccinations", "Health Screenings"],
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "s2",
    name: "MedEquip Pro",
    address: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 234-5678",
    distance: "0.7 mi",
    rating: 4.6,
    reviews: 89,
    isOpen: true,
    hours: "9:00 AM - 7:00 PM",
    category: "Medical Equipment",
    services: ["Wheelchairs", "Oxygen Supplies", "Home Care Equipment"],
    latitude: 40.7148,
    longitude: -74.008,
  },
  {
    id: "s3",
    name: "ClearView Optical",
    address: "789 Pine Road, Westside",
    phone: "+1 (555) 345-6789",
    distance: "1.2 mi",
    rating: 4.9,
    reviews: 312,
    isOpen: true,
    hours: "10:00 AM - 8:00 PM",
    category: "Optical",
    services: ["Eye Exams", "Prescription Glasses", "Contact Lenses"],
    latitude: 40.7158,
    longitude: -74.012,
  },
  {
    id: "s4",
    name: "QuickLab Diagnostics",
    address: "321 Elm Street, Eastside",
    phone: "+1 (555) 456-7890",
    distance: "1.5 mi",
    rating: 4.7,
    reviews: 178,
    isOpen: false,
    hours: "7:00 AM - 6:00 PM",
    category: "Lab & Diagnostics",
    services: ["Blood Tests", "X-Ray", "Ultrasound", "MRI"],
    latitude: 40.7108,
    longitude: -74.002,
  },
  {
    id: "s5",
    name: "WellCare Pharmacy",
    address: "654 Cedar Lane, Northside",
    phone: "+1 (555) 567-8901",
    distance: "1.8 mi",
    rating: 4.5,
    reviews: 156,
    isOpen: true,
    hours: "24 Hours",
    category: "Pharmacy",
    services: ["24/7 Service", "Delivery", "Compounding"],
    latitude: 40.7188,
    longitude: -74.01,
  },
  {
    id: "s6",
    name: "VitaLife Wellness Center",
    address: "987 Birch Blvd, Southside",
    phone: "+1 (555) 678-9012",
    distance: "2.1 mi",
    rating: 4.8,
    reviews: 201,
    isOpen: true,
    hours: "9:00 AM - 9:00 PM",
    category: "Wellness",
    services: ["Supplements", "Nutrition Counseling", "Physiotherapy"],
    latitude: 40.7098,
    longitude: -74.015,
  },
  {
    id: "s7",
    name: "CareFirst Medical Supplies",
    address: "159 Walnut Way, Central",
    phone: "+1 (555) 789-0123",
    distance: "0.9 mi",
    rating: 4.4,
    reviews: 67,
    isOpen: true,
    hours: "8:30 AM - 6:30 PM",
    category: "Medical Equipment",
    services: ["First Aid Kits", "Mobility Aids", "Monitoring Devices"],
    latitude: 40.7138,
    longitude: -74.004,
  },
  {
    id: "s8",
    name: "PrecisionLab Plus",
    address: "753 Maple Court, Uptown",
    phone: "+1 (555) 890-1234",
    distance: "2.5 mi",
    rating: 4.9,
    reviews: 289,
    isOpen: true,
    hours: "6:00 AM - 8:00 PM",
    category: "Lab & Diagnostics",
    services: ["COVID Testing", "Genetic Tests", "Full Body Checkup"],
    latitude: 40.7198,
    longitude: -74.018,
  },
];
