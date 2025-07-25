import pool from "../config/db.js";
import { matchedData } from "express-validator";
import logger from "../middleware/logger.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, completed } = matchedData(req);

    const task = await pool.query(
      `
      INSERT INTO tasks(title, description, completed, user_id)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [title, description, completed, req.userId]
    );

    logger.info(`Task successfully created by user id: ${req.userId}`);
    res.status(201).json(task.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error occured while creating task",
      error: err.message,
    });
    logger.error(err.message);
  }
};

export const getAllTask = async (req, res) => {
  try {
    const tasks = await pool.query(
      `
      SELECT * FROM tasks
      WHERE user_id = $1;
    `,
      [req.userId]
    );

    logger.info(`User id ${req.userId} fetched all his/her task`);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({
      message: "Error occured while getting tasks",
      error: err.message,
    });
    logger.error(err.message);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, completed } = matchedData(req);

    const task = await pool.query(
      `
      UPDATE tasks
      SET title = $1, description = $2, completed = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *;
    `[(title, description, completed, req.params.id, req.userId)]
    );

    if (req.task.row.length === 0)
      return res.status(404).json({ message: "Task not found" });

    logger.info(`Task updated by user: ${req.userId}`);
    res.json(task.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error occured while updating task",
      error: err.message,
    });
    logger.error(err.message);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `,
      [req.params.id, req.userId]
    );

    if (task.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });
    else if (task.rows[0].user_id !== req.userId)
      return res
        .status(403)
        .json({ message: "This task is forbidden. You have to be authorized" });

    logger.info(`Task deleted by user id: ${req.userId}`);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while deleting task", error: err.message });
    logger.error(err.message);
  }
};
