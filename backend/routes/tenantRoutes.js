import express from "express";
import User from "../models/User.js";
import Allocation from "../models/Allocation.js";
import Room from "../models/Room.js";

const router = express.Router();

/**
 * ================================
 * GET all tenants with allocation
 * ================================
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    const tenants = await Promise.all(
      users.map(async (user) => {
        const allocation = await Allocation.findOne({ user_id: user._id })
          .populate("room_id")
          .sort({ createdAt: -1 });

        return {
          id: user._id,
          email: user.email,
          full_name: user.fullName,
          mobile: user.mobile,
          allocation: allocation
            ? {
                room_id: allocation.room_id?._id || null,
                room_number: allocation.room_id?.room_number || "N/A",
                room_type: allocation.room_id?.room_type || "N/A",
                rent_amount: allocation.rent_amount,
                rent_start_date: allocation.rent_start_date,
                rent_expiry_date: allocation.rent_expiry_date,
                payment_status: allocation.payment_status,
              }
            : null,
        };
      })
    );

    res.json(tenants);
  } catch (err) {
    console.error("GET TENANTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================
 * UPDATE tenant profile & allocation
 * =====================================
 */
router.put("/:id", async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { profileUpdates, allocationUpdates } = req.body;

    if (!tenantId || tenantId.length !== 24) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    // ---- Update user profile ----
    if (profileUpdates) {
      await User.findByIdAndUpdate(tenantId, {
        fullName: profileUpdates.full_name,
        mobile: profileUpdates.mobile,
      });
    }

    if (!allocationUpdates) {
      return res.json({ success: true });
    }

    const existingAllocation = await Allocation.findOne({ user_id: tenantId });

    /**
     * ----------------------------
     * CASE 1: PAYMENT STATUS ONLY
     * ----------------------------
     */
    if (
      allocationUpdates.payment_status &&
      allocationUpdates.room_id === undefined
    ) {
      if (!existingAllocation) {
        return res.status(400).json({ message: "No allocation exists" });
      }

      await Allocation.findByIdAndUpdate(existingAllocation._id, {
        payment_status: allocationUpdates.payment_status,
      });

      return res.json({ success: true });
    }

    /**
     * ----------------------------
     * CASE 2: ROOM ASSIGN / CHANGE
     * ----------------------------
     */
    if (allocationUpdates.room_id) {
      const room = await Room.findById(allocationUpdates.room_id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Note: Room availability is calculated based on capacity and current allocations
      // No need to update is_available here

      const startDate =
        allocationUpdates.rent_start_date ||
        existingAllocation?.rent_start_date ||
        new Date().toISOString().split("T")[0];

      const expiryDate =
        allocationUpdates.rent_expiry_date ||
        existingAllocation?.rent_expiry_date ||
        new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0];

      if (existingAllocation) {
        existingAllocation.room_id = room._id;
        existingAllocation.rent_amount = allocationUpdates.rent_amount || room.monthly_rent;
        existingAllocation.rent_start_date = startDate;
        existingAllocation.rent_expiry_date = expiryDate;
        existingAllocation.payment_status =
          allocationUpdates.payment_status ||
          existingAllocation.payment_status ||
          "pending";
        await existingAllocation.save();
      } else {
        const newAllocation = new Allocation({
          user_id: tenantId,
          room_id: room._id,
          rent_amount: allocationUpdates.rent_amount || room.monthly_rent,
          rent_start_date: startDate,
          rent_expiry_date: expiryDate,
          payment_status:
            allocationUpdates.payment_status || "pending",
        });
        await newAllocation.save();
      }
    }

    /**
     * ----------------------------
     * CASE 3: REMOVE ALLOCATION
     * ----------------------------
     */
    if (allocationUpdates.room_id === null) {
      if (existingAllocation) {
        // Delete the allocation
        await Allocation.findByIdAndDelete(existingAllocation._id);
      }

      return res.json({ success: true });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE TENANT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================
 * GET allocation for user dashboard
 * =====================================
 */
router.get("/allocation/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId.length !== 24) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const allocation = await Allocation.findOne({ user_id: userId })
      .populate("room_id");

    if (!allocation) {
      return res.json({ allocation: null });
    }

    res.json({
      allocation: {
        rent_amount: allocation.rent_amount,
        rent_start_date: allocation.rent_start_date,
        rent_expiry_date: allocation.rent_expiry_date,
        payment_status: allocation.payment_status,
        room: allocation.room_id
          ? {
              room_number: allocation.room_id.room_number,
              room_type: allocation.room_id.room_type,
              amenities: allocation.room_id.amenities || [],
            }
          : null,
      },
    });
  } catch (err) {
    console.error("FETCH DASHBOARD ALLOCATION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
