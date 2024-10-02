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
import authToken from "../middlewares/authToken.js";
// import { getAppTimeline } from "../controllers/settings.js";

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);
router.get("/student/:id", authToken, getStudentById);
router.get("/student/:id/result", authToken, getStudentResult);
router.get("/timeline", getStage);
router.get("/student/:id/choices", authToken, getStudentChoices);

// UPDATE
router.patch("/student/:id/choices", authToken, updateStudentWithChoices);
router.patch("/student/:id/verify", authToken, setStudentVerification);

export default router;
