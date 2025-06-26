const UserTokenModel = require("../models/userTokenModel");

// Handles login: Create or update user token
const UploadUserToken = async (req, res) => {
  try {
    const { accessToken, idToken, refreshToken, account } = req.body;
    const { homeAccountId, username } = account;
    const normalizedUsername = username.toLowerCase();

    const ADMIN_USERNAMES = [
      "apeksha_thakre@hyperminds.tech",
      "vishal_waghmare@hyperminds.tech",
      "shubham_kukreti@hyperminds.tech",
      "priyeshp@hyperminds.tech",
      "ashishk@hyperminds.tech",
      "suvits@hyperminds.tech",
    ];

    
    const isAdmin = ADMIN_USERNAMES.includes(normalizedUsername);

    let user = await UserTokenModel.findOne({ ms_id: homeAccountId });

    if (!user) {
      user = await UserTokenModel.create({
        ms_id: homeAccountId,
        username: normalizedUsername,
        access_token: accessToken,
        refresh_token: refreshToken || null,
        id_token: idToken,
        isApproved: isAdmin ? true : false,
        role: isAdmin ? "admin" : "employee",
        status: "active",
      });
    } else {
      user.access_token = accessToken;
      user.refresh_token = refreshToken || user.refresh_token;
      user.id_token = idToken;
      await user.save();
    }

    res.json({
      success: true,
      message: "Token updated successfully",
      existingUser: {
        username: user.username,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Error updating user token:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update token",
    });
  }
};

// Fetch user info for an already logged-in user
const FetchUserInfo = async (req, res) => {
  try {
    const { ms_id } = req.body;

    if (!ms_id) {
      return res
        .status(400)
        .json({ success: false, message: "ms_id is required" });
    }

    const existingUser = await UserTokenModel.findOne({ ms_id });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      existingUser: {
        username: existingUser.username,
        role: existingUser.role,
        isApproved: existingUser.isApproved,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch user info" });
  }
};



module.exports = { UploadUserToken, FetchUserInfo};
