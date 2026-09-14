const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    receipt: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "paid", "failed", "refunded"],
      default: "created",
    },
    notes: {
      firstName: String,
      lastName: String,
      membershipType: {
        type: String,
        enum: ["silver", "gold", "platinum"],
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
