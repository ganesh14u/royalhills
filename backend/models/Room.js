import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_number: {
      type: String,
      required: true,
      unique: true
    },
    room_type: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true
    },
    monthly_rent: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    is_available: {
      type: Boolean,
      default: true
    },
    amenities: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
