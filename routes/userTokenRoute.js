const express = require("express");
const {
  UploadUserToken,
  FetchUserInfo,
} = require("../controllers/userTokenController");

const router = express.Router();

router.post("/updateToken", UploadUserToken);
router.get("/FetchUserInfo", FetchUserInfo);

module.exports = router;
