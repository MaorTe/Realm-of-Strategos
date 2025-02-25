import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/types";
import { createDatabase } from "../database";

export const authMiddleware = (JWT_SECRET: string, DATABASE_URL: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({ message: "No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      const user = await getUserById(decoded.id, DATABASE_URL);

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      // Attach user and token to the request for downstream use
      (req as any).user = user;
      (req as any).token = token;
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: "Unauthorized", error });
    }
  };
};

async function getUserById(userId: string, DATABASE_URL: string): Promise<User | undefined> {
  const database = createDatabase(DATABASE_URL);
  return (await database
    .selectFrom("user")
    .selectAll()
    .where("id", "=", userId)
    .executeTakeFirst()) as User; // Fetches only the first result or `undefined`
}
