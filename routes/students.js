import express from 'express';
import { createStudentsFromCSV, getStudentById, getStudents, updateStudentWithChoices } from '../controllers/students.js';

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);
router.get("/student/:id", getStudentById)

// UPDATE
router.patch("/student/:id/choices", updateStudentWithChoices);

export default router;