import { checkSchema, validationResult } from "express-validator";

const taskSchema = {
  title: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Title is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Title must be at least 3 characters",
    },
  },
  description: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Description is required",
    },
    isLength: {
      options: { min: 5, max: 100 },
      errorMessage: "Description must be at least 5 characters",
    },
  },
  completed: {
    in: ["body"],
    isBoolean: {
      errorMessage: "Completed must be Boolean",
    },
    notEmpty: {
      errorMessage: "Completed is required",
    },
  },
};

export const taskValidator = [
  checkSchema(taskSchema),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];
