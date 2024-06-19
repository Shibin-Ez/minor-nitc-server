import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import minorRoutes from './routes/minors.js';

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

// ROUTES
app.use("/minors", minorRoutes);

// KEEPING THE SERVER BUSY
const periodicFunction = async () => {
  const response = await fetch(`${process.env.SERVER_URL}/minors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
};

const intervalId = setInterval(periodicFunction, 600000); // 10 minutes

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