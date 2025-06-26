const express = require("express");
const connectDB = require("./utils/dbConn");
const cors = require("cors");

const githubRoutes = require("./routes/githubRoute");
const userTokenRoutes = require("./routes/userTokenRoute");
const projectRoutes = require("./routes/projectRoute");
const adminRoutes = require("./routes/adminRoute");
const app = express();
const PORT = process.env.PORT || 9000;
app.use(cors());

// DB Connection
connectDB();

// Middleware
app.use(express.json());

//Routes
app.use("/api/github", githubRoutes);
app.use("/api/auth", userTokenRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
