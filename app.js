import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./middleware/logger.js";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  logger.info("Home route accessed");
  res.json("server running...");
});

const PORT = process.env.PORT || 8000;

const testConnectionDb = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    logger.info(`Connected to postgres: ${res.rows[0]}`);
  } catch (err) {
    logger.error(err.message);
  }
};

app.listen(PORT, async () => {
  await testConnectionDb();
  logger.info(`Server running on port: http://localhost:${PORT}`);
});
