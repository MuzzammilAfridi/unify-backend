const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

// Create Lead
router.post("/", createLead);

// Get all Leads
router.get("/", getAllLeads);

// Get single Lead
router.get("/:id", getLeadById);

// Update Lead
router.put("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;
