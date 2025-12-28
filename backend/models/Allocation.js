import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    user_id: {
      type: String,
      required: true,
      ref: "User"
    },
    room_id: {
      type: String,
      ref: "Room"
    },
    rent_amount: {
      type: Number,
      required: true
    },
    rent_start_date: {
      type: String,
      required: true
    },
    rent_expiry_date: {
      type: String,
      required: true
    },
    payment_status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Allocation", allocationSchema);