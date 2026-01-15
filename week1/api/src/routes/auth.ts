import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

type User = {
  id: string;
  username: string;
  passwordHash: string;
};

const users: User[] = [];

/**
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "username/password required" });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  users.push({
    id: randomUUID(),
    username,
    passwordHash,
  });

  return res.status(201).json({ message: "Registered" });
});

/**
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ accessToken: token });
});

export default router;
