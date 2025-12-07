const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};



// Verify Access Token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;




