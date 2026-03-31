import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                MediBook
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted platform for booking doctor appointments and accessing quality healthcare from anywhere.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">For Patients</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Video Consultation</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Medical Stores</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">For Doctors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Join as Doctor</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Doctor Dashboard</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 MediBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
