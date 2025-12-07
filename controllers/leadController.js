const Lead = require("../models/Lead");

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("subscriber_id lead_source_id mapping_id raw_id");
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "subscriber_id lead_source_id mapping_id raw_id"
    );

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
