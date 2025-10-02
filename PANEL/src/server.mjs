import express from "express";
import mongoose from "mongoose";
import { comRouter } from "./routes/comRouter.mjs";
import { seedCategories } from "./seed.mjs";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from 'url'; 

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cors());
app.use(express.json());


async function start() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydb");
    console.log("DB CONNECTED");

    await seedCategories();

    app.use("/server/main", comRouter);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server http://localhost:${PORT} listening`);
    });
  } catch (err) {
    console.error("DB CONNECTION ERROR", err);
  }
}

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

start();
