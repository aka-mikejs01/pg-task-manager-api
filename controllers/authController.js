import pool from "../config/db.js";
import { matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import { getAccessToken, getRefreshToken } from "../utils/getToken.js";
import { comparePassowrd } from "../utils/comparePassword.js";
import jwt from "jsonwebtoken";
import logger from "../middleware/logger.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password } = matchedData(req);

    const exist = await pool.query(
      `
      SELECT * FROM users
      WHERE username = $1;
    `,
      [username]
    );

    if (exist.rows.length !== 0) {
      logger.warn(
        `Someone tried to register with existing username: ${exist.rows[0].username}`
      );
      return res.status(401).json({ message: "Username already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await pool.query(
      `
      INSERT INTO users(username, password, created_at)
      VALUES($1, $2, NOW())
      RETURNING *;
    `,
      [username, hashed]
    );

    const accessToken = getAccessToken(user.rows[0].id);
    const refreshToken = getRefreshToken(user.rows[0].id);

    logger.info(`New user registerd: ${user.rows[0].username}`);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occured while registering", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = matchedData(req);

    const user = await pool.query(
      `
      SELECT * FROM users
      WHERE username = $1;
    `,
      [username]
    );

    if (user.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await comparePassowrd(password, user.rows[0].password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    logger.info(`User ${user.rows[0].username} logged in`);

    const accessToken = getAccessToken(user.rows[0].id);
    const refreshToken = getRefreshToken(user.rows[0].id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occured while loggin in", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Logged out successfully" });
    logger.info("User logged out");
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Error occured", error: err.message });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: "No token provided" });

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const accessToken = getAccessToken(decoded.userId);
    res.json({ accessToken });
    logger.info(`User with id ${decoded.userId} refreshed token`);
  });
};
