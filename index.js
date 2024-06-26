import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import path from "path";

import minorRoutes from "./routes/minors.js";
import studentRoutes from "./routes/students.js";
import adminRoutes from "./routes/admin.js";
import { uploadCSV } from "./controllers/admin.js";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet()); // if not used with helmet, cors will not work
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, "students.csv");
  },
});

const csvFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".csv") {
    return cb(new Error("Only CSV files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: csvFileFilter });

// Error handling middleware
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only CSV files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// ROUTE WITH FILES
app.post("/admin/upload/csv", upload.single("file"), uploadCSV, handleMulterErrors);

// ROUTES
app.use("/minors", minorRoutes);
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);

// KEEPING THE SERVER BUSY
// const periodicFunction = async () => {
//   const response = await fetch(`${process.env.SERVER_URL}/minors`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await response.json();
//   console.log(data);
// };

// const intervalId = setInterval(periodicFunction, 600000); // 10 minutes

// DATABASE CONNECTION
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    // // ADD DATA ONE TIME
    // Product.insertMany(products);
  })
  .catch((err) => console.log(`${err} did not connect}`));
