const express = require("express");
const router = express.Router();

const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription
} = require("../controllers/subscriptionController");

// Create
router.post("/", createSubscription);

// Read All
router.get("/", getAllSubscriptions);

// Read One
router.get("/:id", getSubscriptionById);

// Update
router.put("/:id", updateSubscription);

// Delete
router.delete("/:id", deleteSubscription);

module.exports = router;
