const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

const leadSourceSchema = new mongoose.Schema(
  {
   

    // uuid: {
    //   type: String,
    //   default: uuidv4,
    //   unique: true,
    // },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["FACEBOOK", "GOOGLE", "LINKEDIN", "WEBSITE", "OTHER"],
      required: true,
    },

    external_source_id: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeadSource", leadSourceSchema);
