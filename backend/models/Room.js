import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  room_number: { type: String, required: true },
  room_type: { type: String, required: true },
  amenities: [{ type: String }],
});

const Room = mongoose.model("Room", RoomSchema);
export default Room; // ✅ default export
