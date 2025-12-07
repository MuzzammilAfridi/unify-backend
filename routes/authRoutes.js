const express = require("express");
const router = express.Router();

const { register, login, refreshToken, profile, logout } = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);

router.get("/profile", auth, profile);

router.get("/admin-dashboard", auth, role("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});


module.exports = router;
