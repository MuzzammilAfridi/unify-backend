const mongoose = require("mongoose");

const leadSourceMappingSchema = new mongoose.Schema(
  {
    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },

    lead_source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeadSourceMapping", leadSourceMappingSchema);
