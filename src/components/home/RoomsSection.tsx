import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDouble from "@/assets/room-double.jpg";
import roomTriple from "@/assets/room-triple.jpg";

const RoomsSection = () => {
  const rooms = [
    {
      type: "Single Occupancy",
      price: "₹12,000",
      period: "/month",
      image: roomSingle,
      features: ["Private Room", "Attached Bathroom", "Study Desk", "Wardrobe"],
      occupancy: 1,
      popular: false,
    },
    {
      type: "Double Sharing",
      price: "₹8,500",
      period: "/month",
      image: roomDouble,
      features: ["Shared Room", "Attached Bathroom", "Study Desk", "Wardrobe"],
      occupancy: 2,
      popular: true,
    },
    {
      type: "Triple Sharing",
      price: "₹6,500",
      period: "/month",
      image: roomTriple,
      features: ["Shared Room", "Common Bathroom", "Study Desk", "Wardrobe"],
      occupancy: 3,
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase font-body">
            Accommodation Options
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Choose Your Perfect Room
          </h2>
          <p className="text-muted-foreground font-body">
            We offer a variety of room options to suit your budget and preferences.
            All rooms come with modern amenities and regular housekeeping.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover-lift bg-card border-border/50 ${
                room.popular ? "ring-2 ring-accent" : ""
              }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image}
                  alt={`${room.type} room at Royal Hills PG`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {room.popular && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-foreground/80 text-background rounded-full px-3 py-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-body">
                    {room.occupancy} {room.occupancy === 1 ? "Person" : "Persons"}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Title & Price */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {room.type}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-accent font-body">
                      {room.price}
                    </span>
                    <span className="text-muted-foreground text-sm font-body">
                      {room.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-muted-foreground text-sm font-body"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/rooms">
                  <Button
                    variant={room.popular ? "gold" : "outline"}
                    className="w-full"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
