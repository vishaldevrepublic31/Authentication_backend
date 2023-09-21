import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { v2 } from "cloudinary";

import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";

var corsOptions = {
  origin: "http://localhost:5173",
};

const app = express();
const PORT = 5000;
dotenv.config();

connectDb();

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
