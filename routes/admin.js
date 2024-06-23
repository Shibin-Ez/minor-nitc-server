import express from 'express';
import { allocateMinors, downloadCSV } from '../controllers/admin.js';

const router = express.Router();

// RUN
router.put("/allocate", allocateMinors);
router.get("/allocate", allocateMinors);
router.get("/download/csv", downloadCSV);

export default router;