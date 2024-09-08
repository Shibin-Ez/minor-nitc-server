import express from 'express';
import { createMinor, createMinorsFromCSV, getMinorById, getMinors } from '../controllers/minors.js';

const router = express.Router();

// CREATE
router.post('/', createMinor);
// router.post("/csv", createMinorsFromCSV);

// READ
router.get('/', getMinors);
router.get("/minor/:id", getMinorById);

export default router;