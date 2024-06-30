import express from "express";
import { confirmAllocation, downloadCSV, getMinorAllocation } from "../controllers/admin.js";
import { editTimeline, getTimeline, resetTimeline, setTimeline } from "../controllers/settings.js";

const router = express.Router();

// RUN
router.put("/allocate", getMinorAllocation);
router.get("/allocate", getMinorAllocation);
router.get("/download/csv", downloadCSV);
router.patch("/allocate/confirm", confirmAllocation);

// TIMELINE
router.post("/timeline", setTimeline);
router.get("/timeline", getTimeline);
router.patch("/timeline", editTimeline);
router.delete("/timeline", resetTimeline);

export default router;
