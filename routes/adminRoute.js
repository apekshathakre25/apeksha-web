const express = require("express");
const {
  getPendingUsers,
  approveUser,
} = require("../controllers/adminController");

const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pending-users", authenticateUser, requireAdmin, getPendingUsers);
router.patch(
  "/approve-user/:userId",
  authenticateUser,
  requireAdmin,
  approveUser
);

module.exports = router;
