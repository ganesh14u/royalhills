import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Tech Mahindra",
      content:
        "Royal Hills has been my home for the past year. The rooms are spacious, food is amazing, and the staff is incredibly helpful. Highly recommended!",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Data Analyst",
      company: "Infosys",
      content:
        "The best PG I've stayed in Bangalore. Great location near the metro, excellent WiFi, and the monthly rent payment through their app is super convenient.",
      rating: 5,
    },
    {
      name: "Ananya Reddy",
      role: "UX Designer",
      company: "Flipkart",
      content:
        "Clean rooms, friendly roommates, and delicious home-style food. The community events are a great way to meet new people. Love it here!",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase font-body">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">
            What Our Residents Say
          </h2>
          <p className="text-primary-foreground/70 font-body">
            Don't just take our word for it. Here's what our happy residents
            have to say about their experience at Royal Hills.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm hover-lift"
            >
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-primary-foreground/90 font-body leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-bold font-body">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-primary-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-primary-foreground/60 text-sm font-body">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-primary-foreground/10">
          {[
            { value: "500+", label: "Happy Residents" },
            { value: "98%", label: "Occupancy Rate" },
            { value: "4.9", label: "Google Rating" },
            { value: "5+", label: "Years of Trust" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/70 text-sm font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
