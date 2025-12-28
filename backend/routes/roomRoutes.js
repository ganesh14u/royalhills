import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

/**
 * GET all rooms
 */
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ room_number: 1 });
    res.json(
      rooms.map((r) => ({
        id: r._id,
        ...r.toObject()
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADD room
 */
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();

    res.status(201).json({
      id: savedRoom._id,
      ...savedRoom.toObject()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE room
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      id: updated._id,
      ...updated.toObject()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE room
 */
router.delete("/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
