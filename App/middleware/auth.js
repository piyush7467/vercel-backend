const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1]; 
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = authMiddleware;
