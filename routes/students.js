import express from "express";
import {
  createStudentsFromCSV,
  getStudentById,
  getStudents,
  updateStudentWithChoices,
} from "../controllers/students.js";
import { getAppTimeline } from "../controllers/settings.js";

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);
router.get("/student/:id", getStudentById);
router.get("/timeline", getAppTimeline);

// UPDATE
router.patch("/student/:id/choices", updateStudentWithChoices);

export default router;
