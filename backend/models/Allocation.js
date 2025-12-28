import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
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
      enum: ["paid", "pending", "overdue"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Allocation", allocationSchema);
