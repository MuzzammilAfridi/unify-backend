const  mongoose =require("mongoose") ;

const planRequestSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessCategory: {
      type: String,
      required: true,
    },
    cityOrLocation: {
      type: String,
      required: true,
    },

    // Contact Person
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },

    // Plan Selection
    plan: {
      type: String,
      enum: ["basic", "standard", "pro"],
      required: true,
    },

    status:{
      type: String,
     
    },

    // Additional Requirements
    requirement: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const PlanRequest = mongoose.model("PlanRequest", planRequestSchema);

module.exports= PlanRequest;
