import express from 'express';
import { allocateMinors } from '../controllers/admin.js';

const router = express.Router();

// RUN
router.put("/allocate", allocateMinors);
router.get("/allocate", allocateMinors);

export default router;