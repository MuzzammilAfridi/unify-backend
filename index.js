const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const leadRoutes = require("./routes/leadRoutes");
const leadSourceRoutes = require("./routes/leadSourceRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const leadSourceMappingRoutes = require("./routes/leadSourceMappingRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");


dotenv.config();
const app = express();
connectDB();

// ✅ FORCE-REGISTER ALL MODELS HERE
require("./models/Plan");               // ✅ THIS WAS MISSING (MAIN ISSUE)
require("./models/Subscription");
require("./models/Subscriber");
require("./models/AcceptedPlanRequest");
require("./models/PlanRequest");


app.use(cors({
  origin: "https://unify-backend-5ybf.onrender.com", // ✅ Your frontend URL
  credentials: true               // ✅ Allow cookies / auth headers
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/plan-request", require("./routes/planRoutes"));
app.use("/api/plans", require("./routes/planDetailsRoutes"));


app.use("/api/leads", leadRoutes);
app.use("/api/lead-sources", leadSourceRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/lead-source-mappings", leadSourceMappingRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
