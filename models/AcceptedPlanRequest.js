const mongoose = require("mongoose");

const acceptedPlanRequestSchema = new mongoose.Schema(
  {
    businessName: String,
    businessCategory: String,
    cityOrLocation: String,
    name: String,
    email: String,
    phone: String,
    plan: String,
    requirement: String,
    originalRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanRequest",
    },
    status: {
      type: String,
      default: "accepted"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcceptedPlanRequest", acceptedPlanRequestSchema);
