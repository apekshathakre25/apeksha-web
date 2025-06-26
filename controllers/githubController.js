const GithubModel = require("../models/githubModel");

const getAllDetails = async (req, res) => {
  const allData = await GithubModel.find({});
  res.json(allData);
};


const getMetrics = async (req, res) => {
  try {
    const { repo, startDate, endDate } = req.query;

    if (!repo || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "repo, startDate, and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const metrics = await GithubModel.aggregate([
      {
        $match: {
          repo,
          timestamp: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$user_id",
          totalCommits: { $sum: "$commits" },
          totalLinesAdded: { $sum: "$additions" },
          totalLinesDeleted: { $sum: "$deletions" },
        },
      },
      {
        $addFields: {
          userObjId: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$user.User",
          gitUsername: "$user.gitUsername",
          totalCommits: 1,
          totalLinesAdded: 1,
          totalLinesDeleted: 1,
        },
      },
    ]);
    res.json(metrics);
  } catch (err) {
    console.error("Error in getRepoMetricsByDate:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllDetails, getMetrics };
