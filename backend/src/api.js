const express = require("express");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = "/api";

app.use(express.json());

// Import routes
const movieRoutes = require("./routes/movies");
const studioRoutes = require("./routes/studios");
const actorRoutes = require("./routes/actors");
const userRoutes = require("./routes/users");
const cors = require("cors");

app.use(cors());

// Health route
app.get(`${API_BASE_URL}/health`, (req, res) => {
  res.json({
    status: "OK",
  });
});

// Use routes
app.use(API_BASE_URL, movieRoutes);
app.use(API_BASE_URL, studioRoutes);
app.use(API_BASE_URL, actorRoutes);
app.use(API_BASE_URL, userRoutes);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});