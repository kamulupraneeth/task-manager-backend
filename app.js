require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:12361`;

const app = express();
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));
