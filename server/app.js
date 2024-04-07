import express from "express";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import connectDB from "./db/connect.js";
import { config as dotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use("/health", (req, res) => {
  res.send("Auth Server Working...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
