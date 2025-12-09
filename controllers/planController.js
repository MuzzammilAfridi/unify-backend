const PlanRequest = require("../models/PlanRequest");
const AcceptedPlanRequest = require("../models/AcceptedPlanRequest");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

// Create plan request
exports.createPlanRequest = async (req, res) => {
  try {
    const {
      status,
      subscriber_id,
      owner_user_id,
      plan,        // "basic" | "standard" | "pro"
      plan_id      // optional
    } = req.body;

    // ✅ 1. CREATE ORIGINAL PLAN REQUEST
    const newRequest = await PlanRequest.create(req.body);

    // ✅ 2. IF STATUS = ACCEPTED → MOVE TO ACCEPTED TABLE + CREATE SUBSCRIPTION
    if (status === "accepted") {

      // ✅ A. RESOLVE SUBSCRIBER
      let resolvedSubscriberId = subscriber_id;

      if (!resolvedSubscriberId && owner_user_id) {
        const existingSubscriber = await Subscriber.findOne({ owner_user_id });

        if (existingSubscriber) {
          resolvedSubscriberId = existingSubscriber._id;
        } else {
          // ✅ CREATE SUBSCRIBER ONLY IF owner_user_id EXISTS
          const newSubscriber = await Subscriber.create({
            contact_phone: req.body.phone || "",
            contact_email: req.body.email || "",
            owner_user_id
          });

          resolvedSubscriberId = newSubscriber._id;
        }
      }

      if (!resolvedSubscriberId) {
        return res.status(400).json({
          msg: "subscriber_id or owner_user_id is required for accepted requests"
        });
      }

      // ✅ B. RESOLVE PLAN
      let resolvedPlanId = plan_id;

      if (!resolvedPlanId && plan) {
        const planDoc = await Plan.findOne({ name: plan });

        if (!planDoc) {
          return res.status(400).json({ msg: "Invalid plan" });
        }

        resolvedPlanId = planDoc._id;
      }

      if (!resolvedPlanId) {
        return res.status(400).json({
          msg: "plan or plan_id is required for accepted requests"
        });
      }

      // ✅ C. CREATE ACCEPTED PLAN
      const acceptedEntry = await AcceptedPlanRequest.create({
        businessName: newRequest.businessName,
        businessCategory: newRequest.businessCategory,
        cityOrLocation: newRequest.cityOrLocation,

        name: newRequest.name,
        email: newRequest.email,
        phone: newRequest.phone,

        plan_id: resolvedPlanId,
        requirement: newRequest.requirement,

        originalRequestId: newRequest._id,
        subscriber_id: resolvedSubscriberId,
        status: "accepted"
      });

      // ✅ D. CREATE SUBSCRIPTION
      await Subscription.create({
        subscriber_id: resolvedSubscriberId,
        plan_id: resolvedPlanId,
        status: "ACTIVE"
      });

      // ✅ E. DELETE ORIGINAL REQUEST
      await PlanRequest.findByIdAndDelete(newRequest._id);

      return res.status(201).json({
        msg: "✅ Plan accepted, subscriber linked & subscription created",
        data: acceptedEntry
      });
    }

    // ✅ 3. IF STATUS = PENDING → JUST SAVE
    return res.status(201).json({
      msg: "✅ Plan request created (pending)",
      data: newRequest
    });

  } catch (error) {
    console.error("❌ createPlanRequest error:", error);
    return res.status(400).json({ msg: error.message });
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
    const { status, subscriber_id, plan_id } = req.body;

    // ✅ Validate status
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    // ✅ Validate required fields if accepting
    if (status === "accepted") {
      if (!subscriber_id || !plan_id) {
        return res.status(400).json({
          msg: "subscriber_id and plan_id are required for acceptance"
        });
      }
    }

    // ✅ Find original request
    const request = await PlanRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // ✅ IF ACCEPTED → MOVE TO AcceptedPlanRequest
    if (status === "accepted") {

      const acceptedEntry = await AcceptedPlanRequest.create({
        businessName: request.businessName,
        businessCategory: request.businessCategory,
        cityOrLocation: request.cityOrLocation,

        name: request.name,
        email: request.email,
        phone: request.phone,

        plan_id,                    // ✅ NOW PASSED
        requirement: request.requirement,

        originalRequestId: request._id,
        subscriber_id,              // ✅ NOW PASSED
        status: "accepted"
      });

      // ✅ OPTIONAL: Auto-create Subscription
      await Subscription.create({
        subscriber_id,
        plan_id,
        status: "ACTIVE"
      });

      // ✅ Delete from original table
      await PlanRequest.findByIdAndDelete(req.params.id);

      return res.json({
        msg: "Request accepted and mapped to subscriber successfully",
        data: acceptedEntry
      });
    }

    // ✅ IF REJECTED → JUST UPDATE STATUS
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
      .populate("plan_id", "name price durationInDays")   // ✅ POPULATE PLAN
      .populate({
        path: "subscriber_id",                           // ✅ POPULATE SUBSCRIBER + USER
        populate: {
          path: "owner_user_id",
          select: "name email role"
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: acceptedRequests
    });

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

