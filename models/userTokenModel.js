const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {
    ms_id: {
      type: String,
      required: [true, "Microsoft ID is required"],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    profile_photo: {
      type: String,
      default: null,
      trim: true,
    },
    access_token: {
      type: String,
      required: [true, "Access token is required"],
    },
    refresh_token: {
      type: String,
      default: null,
    },
    id_token: {
      type: String,
      required: [true, "ID token is required"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "userTokens",
    timestamps: true,
  }
);

UserTokenSchema.index({ ms_id: 1 });
UserTokenSchema.index({ username: 1 });
UserTokenSchema.index({ role: 1 });
UserTokenSchema.index({ status: 1 });

// Admin usernames list
const ADMIN_USERNAMES = [
  "apeksha_thakre@hyperminds.tech",
  "vishal_waghmare@hyperminds.tech",
  "shubham_kukreti@hyperminds.tech",
  "priyeshp@hyperminds.tech",
  "ashishk@hyperminds.tech",
  "suvits@hyperminds.tech",
];

UserTokenSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  if (ADMIN_USERNAMES.includes(this.username.toLowerCase())) {
    this.role = "admin";
  } else {
    this.role = "employee";
  }
  next();
});

// Instance methods
UserTokenSchema.methods.isTokenExpired = function () {
  return false;
};

UserTokenSchema.methods.isActive = function () {
  return this.status === "active";
};

UserTokenSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

// Static methods
UserTokenSchema.statics.findByMsId = function (msId) {
  return this.findOne({ ms_id: msId });
};

module.exports = mongoose.model("UserToken", UserTokenSchema);
