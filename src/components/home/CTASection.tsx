import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in booking a room at Royal Hills PG. Please share more details."
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <section className="py-24 bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <span className="text-accent font-semibold text-sm tracking-wider uppercase font-body">
            Ready to Move In?
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Book Your Room Today
          </h2>
          <p className="text-muted-foreground text-lg font-body mb-10 max-w-2xl mx-auto">
            Join our community of professionals and students. Schedule a visit
            to experience the Royal Hills difference. Limited rooms available!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Schedule a Visit
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="xl">
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </Button>
            </a>
            <a href="tel:+919876543210">
              <Button variant="outline" size="xl">
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm font-body mb-4">
              Trusted by 500+ residents
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              {["Secure Payments", "No Brokerage", "Instant Booking", "24/7 Support"].map(
                (badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-foreground/80"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-sm font-body">{badge}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
