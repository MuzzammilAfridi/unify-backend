const express = require("express");
const router = express.Router();

const { register, login, refreshToken, profile, logout,  getUserById, updateUser, getAllUsers    } = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);



// GET all users (admin only). Remove role middleware if you want non-admins to fetch users.
router.get("/users", auth, role("admin"), getAllUsers);

// ✅ Get User By ID (Protected)
router.get("/user/:id", auth, getUserById);

router.put("/user/:id", auth, updateUser);

router.get("/profile", auth, profile);

router.get("/admin-dashboard", auth, role("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});


module.exports = router;
