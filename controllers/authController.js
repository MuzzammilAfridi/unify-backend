const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      role: role || "user"
    });

    res.json({ msg: "User registered", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
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


