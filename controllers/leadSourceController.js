const LeadSource = require("../models/LeadSource");

// Create Lead Source
exports.createLeadSource = async (req, res) => {
  try {
    const leadSource = await LeadSource.create(req.body);
    res.status(201).json({ success: true, data: leadSource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Lead Sources
exports.getAllLeadSources = async (req, res) => {
  try {
    const leadSources = await LeadSource.find();
    res.status(200).json({ success: true, data: leadSources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Lead Source by ID
exports.getLeadSourceById = async (req, res) => {
  try {
    const leadSource = await LeadSource.findById(req.params.id);

    if (!leadSource)
      return res.status(404).json({ success: false, message: "Lead source not found" });

    res.status(200).json({ success: true, data: leadSource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Lead Source
exports.updateLeadSource = async (req, res) => {
  try {
    const leadSource = await LeadSource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!leadSource)
      return res.status(404).json({ success: false, message: "Lead source not found" });

    res.status(200).json({ success: true, data: leadSource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Lead Source
exports.deleteLeadSource = async (req, res) => {
  try {
    const leadSource = await LeadSource.findByIdAndDelete(req.params.id);

    if (!leadSource)
      return res.status(404).json({ success: false, message: "Lead source not found" });

    res.status(200).json({ success: true, message: "Lead source deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
