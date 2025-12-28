import express from "express";
import Allocation from "../models/Allocation.js";

const router = express.Router();

router.get("/tenants", async (req, res) => {
  try {
    const tenants = await Allocation.find()
      .populate("user_id", "full_name email mobile")
      .populate("room_id", "room_number room_type monthly_rent");

    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
