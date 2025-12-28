import express from "express";
import mongoose from "mongoose";
import Allocation from "../models/Allocation.js";
import Room from "../models/Room.js";

const router = express.Router();

// GET user allocation
router.get("/tenants/allocation/:userId", async (req, res) => {
  try {
    const allocation = await Allocation.findOne({
      user_id: req.params.userId
    })
      .populate("room_id")
      .sort({ createdAt: -1 });

    if (!allocation) {
      return res.json({ allocation: null });
    }

    res.json({
      allocation: {
        rent_amount: allocation.rent_amount,
        rent_start_date: allocation.rent_start_date,
        rent_expiry_date: allocation.rent_expiry_date,
        payment_status: allocation.payment_status,
        room: {
          room_number: allocation.room_id.room_number,
          room_type: allocation.room_id.room_type,
          amenities: allocation.room_id.amenities || []
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// GET user payments
router.get("/payments/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Dummy payments for now
    const payments = [
      {
        id: "1",
        amount: 5000,
        payment_date: "2023-12-01",
        payment_method: "online",
        status: "success",
      },
    ];
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all payments (admin)
router.get("/payments", async (req, res) => {
  // Dummy data for now
  const payments = [
    {
      id: "1",
      tenant_id: "1",
      amount: 5000,
      payment_date: "2023-12-01",
      status: "paid",
    },
  ];
  res.json(payments);
});

// GET settings
router.get("/settings", async (req, res) => {
  const settings = {
    notice_period_days: 30,
    late_fee: 500,
  };
  res.json(settings);
});

// PUT settings
router.put("/settings", async (req, res) => {
  const { notice_period_days, late_fee } = req.body;
  // Save to DB or something, for now just return
  res.json({ notice_period_days, late_fee });
});

export default router;