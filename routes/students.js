import express from "express";
import {
  createStudentsFromCSV,
  getStudentById,
  getStudentChoices,
  getStudentResult,
  getStudents,
  setStudentVerification,
  updateStudentWithChoices,
} from "../controllers/students.js";
import { getStage } from "../controllers/settings.js";
// import { getAppTimeline } from "../controllers/settings.js";

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);
router.get("/student/:id", getStudentById);
router.get("/student/:id/result", getStudentResult);
router.get("/timeline", getStage);
router.get("/student/:id/choices", getStudentChoices);

// UPDATE
router.patch("/student/:id/choices", updateStudentWithChoices);
router.patch("/student/:id/verify", setStudentVerification);

export default router;
