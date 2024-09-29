import express from "express";
import { confirmAllocation, downloadCSV, downloadCSVMinorAllocation, downloadCSVStudentsAllocation, getMinorAllocation, randomAlloteChoices } from "../controllers/admin.js";
import { editTimeline, getTimeline, resetTimeline, setTimeline } from "../controllers/settings.js";

const router = express.Router();

// GET
router.get("/allocate", getMinorAllocation);
router.get("/download/csv", downloadCSV);
router.get("/allocate/students/download", downloadCSVStudentsAllocation);
router.get("/allocate/minor/:id/download", downloadCSVMinorAllocation);


// UPDATE
router.patch("/allocate/confirm", confirmAllocation);
router.patch("/allocate/random", randomAlloteChoices);

// TIMELINE
router.post("/timeline", setTimeline);
router.get("/timeline", getTimeline);
router.patch("/timeline", editTimeline);
router.delete("/timeline", resetTimeline);

export default router;
