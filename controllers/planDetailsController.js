const Plan = require("../models/Plan");

// ✅ Create Plan
exports.createPlan = async (req, res) => {
  try {
    const { name, price, durationInDays } = req.body;

    if (!name || !price || !durationInDays) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await Plan.findOne({ name });
    if (existing) {
      return res.status(400).json({ msg: "Plan already exists" });
    }

    const plan = await Plan.create({
      name,
      price,
      durationInDays
    });

    res.status(201).json({
      msg: "Plan created successfully",
      data: plan
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// ✅ Get All Plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get Plan By ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ msg: "Plan not found" });
    }

    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ msg: "Plan not found" });
    }

    res.json({
      msg: "Plan updated successfully",
      data: plan
    });

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// ✅ Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ msg: "Plan not found" });
    }

    res.json({
      msg: "Plan deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
