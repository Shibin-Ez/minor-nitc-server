import express from "express";
import { confirmAllocation, downloadCSV, downloadCSVMinorAllocation, downloadCSVStudentsAllocation, getMinorAllocation, getSingleMinorAllocation, randomAlloteChoices } from "../controllers/admin.js";
import { editTimeline, getTimeline, resetTimeline, setTimeline } from "../controllers/settings.js";
import authToken from "../middlewares/authToken.js";

const router = express.Router();

// GET
router.get("/allocate", authToken, getMinorAllocation);
router.get("/download/csv", authToken, downloadCSV);
router.get("/allocate/students/download", authToken, downloadCSVStudentsAllocation);
router.get("/allocate/minor/:id/download", authToken, downloadCSVMinorAllocation);
router.get("/allocate/minor/:id", authToken, getSingleMinorAllocation);


// UPDATE
router.patch("/allocate/confirm", authToken, confirmAllocation);
router.patch("/allocate/random", authToken, randomAlloteChoices);

// TIMELINE
router.post("/timeline", authToken, setTimeline);
router.get("/timeline", authToken, getTimeline);
router.patch("/timeline", authToken, editTimeline);
router.delete("/timeline", authToken, resetTimeline);

export default router;
