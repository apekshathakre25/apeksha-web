const express = require("express");
const {
  getAllDetails,
  getMetrics,
} = require("../controllers/githubController");

const router = express.Router();


router.get("/getAll", getAllDetails);
router.get("/getMetrics", getMetrics);

module.exports = router;
