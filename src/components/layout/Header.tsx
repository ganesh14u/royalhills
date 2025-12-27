import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, Phone, User, LogIn, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut, loading } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Rooms" },
    { href: "/amenities", label: "Amenities" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform duration-300">
              <Crown className="w-6 h-6 text-navy-dark" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Royal Hills
              </h1>
              <p className="text-xs text-muted-foreground font-body tracking-wider uppercase">
                Premium PG Living
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(link.href)
                    ? "text-accent"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-body">+91 98765 43210</span>
            </a>
            
            {loading ? (
              <div className="w-24 h-9 bg-secondary/50 rounded animate-pulse" />
            ) : user ? (
              <>
                {/* Admin Button - Only visible for admins */}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                {/* Dashboard Button - Visible for all logged in users */}
                <Link to="/dashboard">
                  <Button variant="gold" size="sm">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="gold" size="sm">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-body text-base font-medium py-2 ${
                    isActive(link.href)
                      ? "text-accent"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {loading ? (
                  <div className="w-full h-10 bg-secondary/50 rounded animate-pulse" />
                ) : user ? (
                  <>
                    {/* Admin Button - Only visible for admins */}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    
                    {/* Dashboard Button - Visible for all logged in users */}
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="gold" className="w-full">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="gold" className="w-full">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
