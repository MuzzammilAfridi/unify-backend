const express = require("express");
const router = express.Router();

const {
  createPlanRequest,
  getAllPlanRequests,
  getPlanRequestById,
  deletePlanRequest,
  updatePlanRequestStatus,
  getAllAcceptedRequests,
  deleteAcceptedRequest,
  getAcceptedRequestById,
  getAdminDashboardStats,
} = require("../controllers/planController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Create plan request (public)
router.post("/", createPlanRequest);

// Admin: get all
router.get("/", auth, role("admin"), getAllPlanRequests);
router.get("/admin/dashboard", auth, role("admin"), getAdminDashboardStats);


router.get("/subscriber", getAllAcceptedRequests);

router.delete("/subscriber/:id", deleteAcceptedRequest);
router.get("/subscriber/:id", getAcceptedRequestById);


// Get single request (admin only)
router.get("/:id", auth, role("admin"), getPlanRequestById);

// Delete request (admin only)
router.delete("/:id", auth, role("admin"), deletePlanRequest);

router.patch("/:id/status",updatePlanRequestStatus);



module.exports = router;
