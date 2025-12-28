import express from "express";

const router = express.Router();

// GET payments
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