const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const leadSourceRoutes = require("./routes/leadSourceRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const leadSourceMappingRoutes = require("./routes/leadSourceMappingRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
// import planRequestRoutes from "./routes/planRequest.routes.js";


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/plan-request", require("./routes/planRoutes"));

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
