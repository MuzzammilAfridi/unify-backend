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
    const leads = await Lead.find()

      // ✅ populate subscriber
      .populate({
        path: "subscriber_id",
        populate: {
          path: "owner_user_id",    // ✅ THIS fetches USER
          select: "name email role"
        }
      })

      // ✅ populate lead source
      .populate("lead_source_id")

      // ✅ populate mapping
      .populate("mapping_id")

      // ✅ populate raw data (optional)
      .populate("raw_id");

    res.status(200).json({
      success: true,
      data: leads
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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


// ✅ Get Leads by User ID (via Subscriber)
exports.getLeadsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const leads = await Lead.find()
      .populate({
        path: "subscriber_id",
        match: { owner_user_id: userId },   // ✅ FILTER BY USER
      })
      .populate("raw_id lead_source_id mapping_id");

    // ✅ Remove leads where subscriber didn't match
    const filteredLeads = leads.filter(lead => lead.subscriber_id !== null);

    if (filteredLeads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leads found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: filteredLeads.length,
      data: filteredLeads,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
