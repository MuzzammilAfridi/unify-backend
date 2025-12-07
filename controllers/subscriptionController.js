const Subscription = require("../models/Subscription");

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
