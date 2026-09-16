import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./models/config/db.js";
import routes from "./routes/personRoutes.js";
import corsMiddleware from "./middleware/corsMiddleware.js";

const app = express();

connectDB();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Read HttpOnly cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "business-portfolio-backend",
  });
});

app.use("/api/", routes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});