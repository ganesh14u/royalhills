import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// =========================
// CORS CONFIG
// =========================
const allowedOrigins = [
  "http://localhost:5137",
  "https://royalhills.netlify.app",
  "https://royalhills-3q0i.onrender.com"
];

app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/tenants", tenantRoutes);

// Health check
app.get("/", (req, res) => res.send("Backend running 🚀"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
