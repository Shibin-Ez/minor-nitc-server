import express from 'express';
import { createStudentsFromCSV, getStudentById, getStudents } from '../controllers/students.js';

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);
router.get("/student/:id", getStudentById)

export default router;