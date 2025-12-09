const mongoose = require("mongoose");

const acceptedPlanRequestSchema = new mongoose.Schema(
  {
    businessName: String,
    businessCategory: String,
    cityOrLocation: String,

    name: String,
    email: String,
    phone: String,

    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    requirement: String,

    originalRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanRequest",
      required: true
    },

    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true
    },

    status: {
      type: String,
      default: "accepted"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcceptedPlanRequest", acceptedPlanRequestSchema);
