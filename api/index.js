import express from "express";
import cors from "cors";
import authRoutes from "../src/auth/auth.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend running on Vercel 🚀" });
});

app.use("/api/auth", authRoutes);

// 👇 THIS IS THE MAGIC LINE FOR VERCEL
export default app;
