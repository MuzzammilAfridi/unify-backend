const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "CONVERTED", "REJECTED"],
      default: "NEW",
    },

    raw_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawData",
      required: false,
    },

    lead_source_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: false,
    },

    mapping_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSourceMapping",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
