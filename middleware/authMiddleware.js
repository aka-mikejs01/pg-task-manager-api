import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(403).json({ message: "Token expired" });
    else return res.status(403).json({ message: "Invalid token" });
  }
};
