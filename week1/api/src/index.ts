import "./telemetry";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// basic routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello MindX");
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// auth routes
app.use("/auth", authRoutes);

// protected
app.get("/me", authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
