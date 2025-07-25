import bcrypt from "bcryptjs";

export const comparePassowrd = (plainPassoword, hashedPassword) => {
  return bcrypt.compare(plainPassoword, hashedPassword);
};
