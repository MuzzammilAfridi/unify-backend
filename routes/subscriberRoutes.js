const express = require("express");
const router = express.Router();

const {
  createSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
} = require("../controllers/subscriberController");

// Create
router.post("/", createSubscriber);

// Read All
router.get("/", getAllSubscribers);

// Read One
router.get("/:id", getSubscriberById);

// Update
router.put("/:id", updateSubscriber);

// Delete
router.delete("/:id", deleteSubscriber);

module.exports = router;
