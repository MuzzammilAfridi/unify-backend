const Subscriber = require("../models/Subscriber");

// Create Subscriber
exports.createSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.create(req.body);
    res.status(201).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().populate("owner_user_id");
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get subscriber by ID
exports.getSubscriberById = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id).populate("owner_user_id");

    if (!subscriber)
      return res.status(404).json({ success: false, message: "Subscriber not found" });

    res.status(200).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Subscriber
exports.updateSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subscriber)
      return res.status(404).json({ success: false, message: "Subscriber not found" });

    res.status(200).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber)
      return res.status(404).json({ success: false, message: "Subscriber not found" });

    res.status(200).json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
