import express from "express";
import {
  createMinor,
  createMinorsFromCSV,
  downloadMinorSyallabusPDF,
  getMinorById,
  getMinors,
} from "../controllers/minors.js";
import { downloadCSVMinors } from "../controllers/admin.js";

const router = express.Router();

// CREATE
// router.post('/', createMinor);
// router.post("/csv", createMinorsFromCSV);

// READ
router.get("/", getMinors);
router.get("/minor/:id", getMinorById);
router.get("/minor/:id/download", downloadMinorSyallabusPDF);
router.get("/csv/download", downloadCSVMinors);

export default router;
