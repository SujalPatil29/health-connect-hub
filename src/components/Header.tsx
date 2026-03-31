import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Find Doctors", path: "/doctors" },
    ...(user ? [{ label: "Dashboard", path: "/dashboard" }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Medi<span className="text-gradient-primary">Book</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  {user.name.split(" ")[0]}
                </Button>
              </Link>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {user.role}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
