import express from 'express';
import { createStudentsFromCSV, getStudents } from '../controllers/students.js';

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", getStudents);

export default router;