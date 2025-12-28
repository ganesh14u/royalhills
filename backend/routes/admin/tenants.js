const express = require("express");
const router = express.Router();
const Allocation = require("../../models/Allocation");

// GET Allocation for a user
router.get("/allocation/:userId", async (req, res) => {
  try {
    const allocation = await Allocation.findOne({ user: req.params.userId })
      .populate("room"); // <-- IMPORTANT to populate room

    if (!allocation) return res.status(404).json({ message: "No allocation found" });

    res.json({ allocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
