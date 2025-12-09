const express = require("express");
const router = express.Router();

const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} = require("../controllers/planDetailsController");

// ✅ Create Plan
router.post("/", createPlan);

// ✅ Get All Plans
router.get("/", getAllPlans);

// ✅ Get Single Plan
router.get("/:id", getPlanById);

// ✅ Update Plan
router.put("/:id", updatePlan);

// ✅ Delete Plan
router.delete("/:id", deletePlan);

module.exports = router;
