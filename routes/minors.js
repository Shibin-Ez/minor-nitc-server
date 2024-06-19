import express from 'express';
import { createMinor, getMinors } from '../controllers/minors.js';

const router = express.Router();

// CREATE
router.post('/', createMinor);

// READ
router.get('/', getMinors);

export default router;