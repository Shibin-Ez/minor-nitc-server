import express from 'express';
import { createMinor, getMinorById, getMinors } from '../controllers/minors.js';

const router = express.Router();

// CREATE
router.post('/', createMinor);

// READ
router.get('/', getMinors);
router.get("/minor/:id", getMinorById);

export default router;