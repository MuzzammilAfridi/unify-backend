const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "EXPIRED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },

    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
