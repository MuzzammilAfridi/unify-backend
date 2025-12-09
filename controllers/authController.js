const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subscriber = require("../models/Subscriber");
const TokenBlacklist = require("../models/TokenBlacklist");



const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User FIRST
    const newUser = await User.create({
      name,
      email,
       phone,  
      password: hashedPassword,
      role: "user"
    });

    // ✅ Create Subscriber
    const newSubscriber = await Subscriber.create({
      contact_phone: phone,
      contact_email: email,
      owner_user_id: newUser._id
    });

    // ✅ 🔥 UPDATE USER WITH subscriber_id (MISSING STEP)
    newUser.subscriber_id = newSubscriber._id;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User & Subscriber created successfully",
      user: newUser,
      subscriber: newSubscriber
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      msg: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    // Check blacklist
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) return res.status(403).json({ msg: "Token is blacklisted" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ msg: "Invalid refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Token expired" });

      // Create a new access token
      const newAccessToken = generateAccessToken(user._id, user.role);
      res.json({ accessToken: newAccessToken });
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// GET /api/auth/users?q=<optional search>
exports.getAllUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    // Build search filter if q provided (case-insensitive partial match)
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = {
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex }
        ]
      };
    }

    // Optionally support pagination later (page & limit)
    const users = await User.find(filter)
      .select("-password -refreshToken -__v")
      .lean();

    // Return users with minimal fields; subscribers will be null or ObjectId
    return res.json({ success: true, data: users });
  } catch (err) {
    console.error("getAllUsers:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// ✅ UPDATE USER BY ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ❌ Prevent password & role update directly from here
    const restrictedFields = ["password", "role"];
    restrictedFields.forEach(field => delete req.body[field]);

    // ✅ Only allow self-update OR admin
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      success: true,
      msg: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.refreshToken) {
      await TokenBlacklist.create({
        token: user.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // match refresh token expiry
      });
    }

    // Clear token from user account
    user.refreshToken = null;
    await user.save();

    res.json({ msg: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


