const PlanRequest = require("../models/PlanRequest");
const AcceptedPlanRequest = require("../models/AcceptedPlanRequest");

// Create plan request
exports.createPlanRequest = async (req, res) => {
  try {
    const newRequest = await PlanRequest.create(req.body);
    console.log(req.body);
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Get all (Admin only)
exports.getAllPlanRequests = async (req, res) => {
  try {
    const requests = await PlanRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// Get one by ID
exports.getPlanRequestById = async (req, res) => {
  try {
    const request = await PlanRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete (Admin only)
exports.deletePlanRequest = async (req, res) => {
  try {
    const deleted = await PlanRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// Update status (Accept / Reject)
// Accept or Reject
exports.updatePlanRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    // Find the original request
    const request = await PlanRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // If accepted → move to AcceptedPlanRequest collection
    if (status === "accepted") {
      const acceptedEntry = await AcceptedPlanRequest.create({
        ...request.toObject(),
        originalRequestId: request._id,
        status: "accepted"
      });

      // delete from original table (optional)
      await PlanRequest.findByIdAndDelete(req.params.id);

      return res.json({
        msg: "Request accepted and moved successfully",
        data: acceptedEntry
      });
    }

    // If rejected → just update status
    request.status = "rejected";
    await request.save();

    return res.json({
      msg: "Request rejected",
      data: request
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


exports.getAllAcceptedRequests = async (req, res) => {
  try {
    const acceptedRequests = await AcceptedPlanRequest.find()
      .sort({ createdAt: -1 });

    res.json(acceptedRequests);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete accepted request by ID
exports.deleteAcceptedRequest = async (req, res) => {
  try {
    const deleted = await AcceptedPlanRequest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Accepted request not found" });
    }

    res.json({ msg: "Accepted request deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Get accepted request by ID
exports.getAcceptedRequestById = async (req, res) => {
  try {
    const request = await AcceptedPlanRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: "Accepted request not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// ADMIN DASHBOARD STATS
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // Count requests still in PlanRequest (pending / rejected)
    const pendingCount = await PlanRequest.countDocuments({ status: "pending" });
    const rejectedCount = await PlanRequest.countDocuments({ status: "rejected" });

    // Count accepted requests from separate schema
    const acceptedCount = await AcceptedPlanRequest.countDocuments();

    // Today's requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysRequests = await PlanRequest.countDocuments({
      createdAt: { $gte: today }
    });

    // Group requests by plan
    const planStats = await PlanRequest.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent 5 submissions (including accepted)
    const recent = await PlanRequest.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      pendingCount,
      acceptedCount,
      rejectedCount,
      todaysRequests,
      planStats,
      recent
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

