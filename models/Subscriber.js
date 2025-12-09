const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

const subscriberSchema = new mongoose.Schema(
  {
    // uuid: {
    //   type: String,
    //   default: uuidv4,
    //   unique: true,
    // },

    contact_phone: {
      type: String,
      required: false,
      trim: true,
    },

    contact_email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    owner_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
