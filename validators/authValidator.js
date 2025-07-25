import { checkSchema, validationResult } from "express-validator";

const authSchema = {
  username: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must be at least 3 characters",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
  },
};

export const authValidator = [
  checkSchema(authSchema),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];
