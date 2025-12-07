const express = require("express");
const router = express.Router();

const {
  createLeadSource,
  getAllLeadSources,
  getLeadSourceById,
  updateLeadSource,
  deleteLeadSource,
} = require("../controllers/leadSourceController");

// Create LeadSource
router.post("/", createLeadSource);

// Get all LeadSources
router.get("/", getAllLeadSources);

// Get single LeadSource
router.get("/:id", getLeadSourceById);

// Update LeadSource
router.put("/:id", updateLeadSource);

// Delete LeadSource
router.delete("/:id", deleteLeadSource);

module.exports = router;
