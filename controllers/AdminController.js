const UserTokenModel = require("../models/userTokenModel");

const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await UserTokenModel.find({ isApproved: false });
    res.json({
      success: true,
      users: pendingUsers.map((user) => ({
        _id: user._id,
        username: user.username,
        role: user.role,
        status: user.status,
        isApproved: user.isApproved,
      })),
    });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
    });
  }
};

const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isApproved } = req.body;

    const updatedUser = await UserTokenModel.findByIdAndUpdate(
      userId,
      { isApproved },
      { new: true }
    );

    res.json({
      success: true,
      message: "User approval status updated",
      updatedUser,
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getPendingUsers, approveUser };
