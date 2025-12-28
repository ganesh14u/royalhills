const express = require("express");
const router = express.Router();
const Payment = require("../../models/Payment");

// GET Payments for a user
router.get("/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.params.userId }).sort({ payment_date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
