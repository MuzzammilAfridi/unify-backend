const LeadSourceMapping = require("../models/LeadSourceMapping");

// Create Mapping
exports.createMapping = async (req, res) => {
  try {
    const mapping = await LeadSourceMapping.create(req.body);
    res.status(201).json({ success: true, data: mapping });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Mappings
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await LeadSourceMapping.find()
      .populate("subscriber_id")
      .populate("lead_source");

    res.status(200).json({ success: true, data: mappings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Mapping by ID
exports.getMappingById = async (req, res) => {
  try {
    const mapping = await LeadSourceMapping.findById(req.params.id)
      .populate("subscriber_id")
      .populate("lead_source");

    if (!mapping)
      return res.status(404).json({ success: false, message: "Mapping not found" });

    res.status(200).json({ success: true, data: mapping });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Mapping
exports.updateMapping = async (req, res) => {
  try {
    const mapping = await LeadSourceMapping.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mapping)
      return res.status(404).json({ success: false, message: "Mapping not found" });

    res.status(200).json({ success: true, data: mapping });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Mapping
exports.deleteMapping = async (req, res) => {
  try {
    const mapping = await LeadSourceMapping.findByIdAndDelete(req.params.id);

    if (!mapping)
      return res.status(404).json({ success: false, message: "Mapping not found" });

    res.status(200).json({ success: true, message: "Mapping deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
