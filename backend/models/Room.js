import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  room_number: { type: String, required: true },
  room_type: { type: String, required: true },
  amenities: [{ type: String }],
  rent_amount: { type: Number, required: true },
  monthly_rent: { type: Number, required: true },
  capacity: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
});

const Room = mongoose.model("Room", RoomSchema);
export default Room; // ✅ default export
