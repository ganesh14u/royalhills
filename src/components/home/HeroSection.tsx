import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wifi, Utensils, Car, CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const features = [
    { icon: Shield, text: "24/7 Security" },
    { icon: Wifi, text: "High-Speed WiFi" },
    { icon: Utensils, text: "Homely Food" },
    { icon: Car, text: "Parking Space" },
  ];

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Royal Hills PG building exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-primary-foreground/90 text-sm font-body">
              Premium PG Accommodation in Bangalore
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Experience Luxury Living at{" "}
            <span className="text-accent">Royal Hills</span>
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-primary-foreground/80 font-body leading-relaxed mb-8 max-w-2xl animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Your home away from home. Premium paying guest accommodation with
            modern amenities, comfortable living spaces, and a vibrant community
            atmosphere.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap gap-4 mb-12 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/rooms">
              <Button variant="hero" size="xl">
                Explore Rooms
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-light" size="xl">
                Schedule Visit
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {features.map(({ icon: Icon, text }, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/90 text-sm font-body">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
