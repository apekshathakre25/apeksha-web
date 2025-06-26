const UserToken = require("../models/userTokenModel");

// Middleware to authenticate and attach user to request
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }
    

    // Find user by access token 
    const user = await UserToken.findOne({ access_token: token });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (!user.isActive()) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin()) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Middleware to check if user can access specific user data
const canAccessUserData = (req, res, next) => {
  const requestedUserId = req.params.userId || req.params.ms_id;

  if (req.user.isAdmin()) {
    return next();
  }
  if (
    req.user.ms_id === requestedUserId ||
    req.user._id.toString() === requestedUserId
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. You can only access your own data.",
  });
};

module.exports = {
  authenticateUser,
  requireAdmin,
  canAccessUserData,
};
