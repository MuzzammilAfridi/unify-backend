const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },
    phone: {
    type: String,
    required: false   // ✅ optional for now
  },


  role: { 
    type: String, 
    default: "user", 
    enum: ["user", "admin"] 
  },

  refreshToken: { 
    type: String 
  },

  subscriber_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber",
    default: null   // optional
  }
});

module.exports = mongoose.model("User", userSchema);
