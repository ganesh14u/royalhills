import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, CheckCircle } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDouble from "@/assets/room-double.jpg";
import roomTriple from "@/assets/room-triple.jpg";

const Rooms = () => {
  const rooms = [
    {
      type: "Single Occupancy",
      price: 12000,
      image: roomSingle,
      description:
        "A private sanctuary for those who value their personal space. Ideal for working professionals who need focus and privacy.",
      features: [
        "Private Room (120 sq ft)",
        "Attached Bathroom",
        "Queen-size Bed",
        "Study Desk & Chair",
        "Wardrobe",
        "Air Conditioning",
        "High-Speed WiFi",
        "Daily Housekeeping",
      ],
      occupancy: 1,
      available: 2,
    },
    {
      type: "Double Sharing",
      price: 8500,
      image: roomDouble,
      description:
        "Perfect balance of affordability and comfort. Share your space with a like-minded roommate in a spacious, well-designed room.",
      features: [
        "Shared Room (180 sq ft)",
        "Attached Bathroom",
        "2 Single Beds",
        "2 Study Desks",
        "2 Wardrobes",
        "Air Conditioning",
        "High-Speed WiFi",
        "Daily Housekeeping",
      ],
      occupancy: 2,
      available: 5,
      popular: true,
    },
    {
      type: "Triple Sharing",
      price: 6500,
      image: roomTriple,
      description:
        "An economical choice without compromising on essentials. Great for students and budget-conscious professionals.",
      features: [
        "Shared Room (220 sq ft)",
        "Common Bathroom",
        "3 Single Beds",
        "3 Study Desks",
        "3 Wardrobes",
        "Ceiling Fan",
        "High-Speed WiFi",
        "Daily Housekeeping",
      ],
      occupancy: 3,
      available: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase font-body">
            Our Accommodations
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Find Your Perfect Room
          </h1>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Choose from our range of thoughtfully designed rooms. Each option offers
            comfort, security, and all the amenities you need for a productive stay.
          </p>
        </div>
      </section>

      {/* Rooms List */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {rooms.map((room, index) => (
              <Card
                key={index}
                className={`overflow-hidden shadow-card border-border/50 ${
                  room.popular ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-80 lg:h-auto">
                    <img
                      src={room.image}
                      alt={`${room.type} room at Royal Hills PG`}
                      className="w-full h-full object-cover"
                    />
                    {room.popular && (
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-semibold px-4 py-2 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-foreground/90 text-background rounded-full px-4 py-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-body">
                        {room.occupancy} {room.occupancy === 1 ? "Person" : "Persons"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-8 lg:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                          {room.type}
                        </h2>
                        <Badge variant="secondary" className="font-body">
                          {room.available} rooms available
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-3xl font-bold text-accent">
                          ₹{room.price.toLocaleString()}
                        </div>
                        <span className="text-muted-foreground text-sm font-body">
                          per month
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground font-body mb-6">
                      {room.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {room.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-foreground/80"
                        >
                          <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-sm font-body">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link to="/contact">
                        <Button variant={room.popular ? "gold" : "default"} size="lg">
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="outline" size="lg">
                          Schedule Visit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
