import express from "express";
import User from "../models/User.js";
import Allocation from "../models/Allocation.js";
import Room from "../models/Room.js";

const router = express.Router();

/**
 * GET all tenants with their latest allocation
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const tenants = await Promise.all(
      users.map(async (user) => {
        const allocation = await Allocation.findOne({ user_id: user._id }).sort({ created_at: -1 });
        let allocationData = null;

        if (allocation) {
          const room = await Room.findById(allocation.room_id);
          allocationData = {
            room_id: allocation.room_id,
            room_number: room ? room.room_number : "N/A",
            room_type: room ? room.room_type : "N/A",
            rent_amount: allocation.rent_amount,
            rent_start_date: allocation.rent_start_date,
            rent_expiry_date: allocation.rent_expiry_date,
            payment_status: allocation.payment_status,
          };
        }

        return {
          id: user._id,
          email: user.email,
          full_name: user.fullName,
          mobile: user.mobile,
          allocation: allocationData,
        };
      })
    );

    res.json(tenants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE tenant profile and allocation
 */
router.put("/:id", async (req, res) => {
  try {
    const { profileUpdates, allocationUpdates } = req.body;
    const tenantId = req.params.id;

    // Validate tenant ID
    if (!tenantId || tenantId.length !== 24) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    // Check if user exists
    const existingUser = await User.findById(tenantId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updating tenant:", tenantId);
    console.log("Profile updates:", profileUpdates);
    console.log("Allocation updates:", allocationUpdates);

    // Update user profile
    if (profileUpdates) {
      const updateData = {};
      if (profileUpdates.full_name !== undefined) updateData.fullName = profileUpdates.full_name;
      if (profileUpdates.mobile !== undefined) updateData.mobile = profileUpdates.mobile;
      console.log("Updating user profile:", updateData);
      await User.findByIdAndUpdate(tenantId, updateData);
    }

    // Update allocation
    if (allocationUpdates) {
      const existingAllocation = await Allocation.findOne({ user_id: tenantId });
      console.log("Existing allocation:", existingAllocation);

      // If a new room is assigned
      if (allocationUpdates.room_id) {
        try {
          // Validate room exists
          const newRoom = await Room.findById(allocationUpdates.room_id);
          if (!newRoom) {
            throw new Error(`Room with ID ${allocationUpdates.room_id} not found`);
          }

          // Make previous room available
          if (existingAllocation && existingAllocation.room_id.toString() !== allocationUpdates.room_id.toString()) {
            const oldRoom = await Room.findById(existingAllocation.room_id);
            if (oldRoom) {
              await Room.findByIdAndUpdate(existingAllocation.room_id, { is_available: true });
            }
          }

          // Make new room unavailable
          await Room.findByIdAndUpdate(allocationUpdates.room_id, { is_available: false });

          // Calculate default expiry date (1 month from now)
          const defaultExpiryDate = new Date();
          defaultExpiryDate.setMonth(defaultExpiryDate.getMonth() + 1);
          const expiryDate = allocationUpdates.rent_expiry_date || defaultExpiryDate.toISOString().split("T")[0];

          const allocationData = {
            user_id: tenantId,
            room_id: allocationUpdates.room_id,
            rent_amount: allocationUpdates.rent_amount || 0,
            rent_start_date: allocationUpdates.rent_start_date || new Date().toISOString().split("T")[0],
            rent_expiry_date: expiryDate,
            payment_status: allocationUpdates.payment_status || "pending",
            updated_at: new Date(),
          };

          // Only set ID for new allocations
          if (!existingAllocation) {
            allocationData.id = `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }

          console.log("Creating/updating allocation:", allocationData);

          // Upsert allocation
          await Allocation.findOneAndUpdate({ user_id: tenantId }, allocationData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });
        } catch (roomError) {
          console.error("Error updating room allocation:", roomError);
          throw new Error(`Failed to update room allocation: ${roomError.message}`);
        }
      }

      // If room is set to null (remove allocation)
      if (allocationUpdates.room_id === null && existingAllocation) {
        try {
          const roomToFree = await Room.findById(existingAllocation.room_id);
          if (roomToFree) {
            await Room.findByIdAndUpdate(existingAllocation.room_id, { is_available: true });
          }
          await Allocation.deleteOne({ user_id: tenantId });
        } catch (deleteError) {
          console.error("Error removing allocation:", deleteError);
          throw new Error(`Failed to remove allocation: ${deleteError.message}`);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating tenant:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
