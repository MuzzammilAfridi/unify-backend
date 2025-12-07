const express = require("express");
const router = express.Router();

const {
  createMapping,
  getAllMappings,
  getMappingById,
  updateMapping,
  deleteMapping
} = require("../controllers/leadSourceMappingController");

// Create
router.post("/", createMapping);

// Read All
router.get("/", getAllMappings);

// Read One
router.get("/:id", getMappingById);

// Update
router.put("/:id", updateMapping);

// Delete
router.delete("/:id", deleteMapping);

module.exports = router;
