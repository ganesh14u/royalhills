import {
  Wifi,
  Utensils,
  Shield,
  Car,
  Droplets,
  Zap,
  Tv,
  Shirt,
  Coffee,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

const AmenitiesSection = () => {
  const amenities = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "100 Mbps fiber connection in all rooms",
    },
    {
      icon: Utensils,
      title: "Homely Meals",
      description: "3 delicious meals prepared fresh daily",
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "CCTV surveillance and secure entry",
    },
    {
      icon: Car,
      title: "Parking",
      description: "Covered parking for bikes and cars",
    },
    {
      icon: Droplets,
      title: "Hot Water",
      description: "24/7 hot water supply in bathrooms",
    },
    {
      icon: Zap,
      title: "Power Backup",
      description: "Uninterrupted power supply",
    },
    {
      icon: Tv,
      title: "Recreation Room",
      description: "TV, games, and relaxation area",
    },
    {
      icon: Shirt,
      title: "Laundry",
      description: "Weekly laundry service included",
    },
    {
      icon: Coffee,
      title: "Pantry",
      description: "Common kitchen for light cooking",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Near IT parks and metro station",
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "No strict curfew for working professionals",
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Monthly social gatherings and activities",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-4xl tracking-wider uppercase font-body">
            What We Offer
          </span>
          <h2 className="font-display text-3xl md:text-3xl font-bold text-foreground mt-3 mb-4">
            Premium Amenities
          </h2>
          <p className="text-muted-foreground font-body">
            Enjoy a comfortable stay with our comprehensive range of amenities
            designed for modern professionals and students.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <amenity.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {amenity.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
