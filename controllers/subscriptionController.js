const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan"); 

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const { subscriber_id, plan_id, status } = req.body;

    // ✅ 1. Validate required fields
    if (!subscriber_id || !plan_id) {
      return res.status(400).json({
        success: false,
        message: "subscriber_id and plan_id are required"
      });
    }

    // ✅ 2. Check if Plan exists
    const plan = await Plan.findById(plan_id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Invalid plan_id. Plan not found."
      });
    }

    // ✅ 3. Prevent multiple ACTIVE subscriptions
    const existingActive = await Subscription.findOne({
      subscriber_id,
      status: "ACTIVE"
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: "Subscriber already has an ACTIVE subscription"
      });
    }

    // ✅ 4. Auto-calculate end_date using plan duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    // ✅ 5. Create safe subscription
    const subscription = await Subscription.create({
      subscriber_id,
      plan_id,
      status: status || "ACTIVE",
      start_date: startDate,
      end_date: endDate
    });

    res.status(201).json({
      success: true,
      data: subscription
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("subscriber_id")
      .populate("plan_id");

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("subscriber_id")
      .populate("plan_id");

    if (!subscription)
      return res.status(404).json({ success: false, message: "Subscription not found" });

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Subscription
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subscription)
      return res.status(404).json({ success: false, message: "Subscription not found" });

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription)
      return res.status(404).json({ success: false, message: "Subscription not found" });

    res.status(200).json({ success: true, message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
