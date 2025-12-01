import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import urlRotes from "./routes/url.js";
dotenv.config();
// console.log(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "process.env.FRONTEND_URL", // allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/", urlRotes); // all url related routes

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
