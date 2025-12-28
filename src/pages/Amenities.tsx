import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Amenities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ONLY 4px spacing between sections */}
      <main className="pt-20 space-y-1">
        {/* HERO */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 bg-gradient-to-br from-secondary/40 to-background border-b border-border"
        >
          <div className="container mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Premium Living
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Amenities
            </h1>

            <p className="max-w-2xl mx-auto text-muted-foreground">
              Designed for comfort, safety, and modern professional living.
            </p>
          </div>
        </motion.section>

        {/* AMENITIES GRID */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-1"
        >
          <AmenitiesSection />
        </motion.section>

        {/* WHY CHOOSE US */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-10">
              Why Choose Royal Hills
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Professionally Managed PG",
                "Safe & Secure Environment",
                "High-Speed Internet",
                "Power Backup",
                "Prime Location",
                "Peaceful Community",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-5 bg-card border border-border rounded-xl"
                >
                  <CheckCircle className="text-accent w-5 h-5 mt-1" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Amenities;
