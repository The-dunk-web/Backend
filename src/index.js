import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import routes from "./routes/index.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

connectDB();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
