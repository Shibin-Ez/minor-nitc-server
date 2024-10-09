import express from "express";
import { confirmAllocation, downloadCSV, downloadCSVMinorAllocation, downloadCSVStudentsAllocation, getMinorAllocation, getMinorAllocationStudents, getSingleMinorAllocation, getStudentByIdForAdmin, randomAlloteChoices, updateStudentDetails } from "../controllers/admin.js";
import { editTimeline, getTimeline, resetTimeline, setTimeline } from "../controllers/settings.js";
import authToken from "../middlewares/authToken.js";

const router = express.Router();

// GET
router.get("/allocate", authToken, getMinorAllocation);
router.get("/download/csv", authToken, downloadCSV);
router.get("/allocate/students", authToken, getMinorAllocationStudents);
router.get("/allocate/students/download", authToken, downloadCSVStudentsAllocation);
router.get("/allocate/minor/:id/download", authToken, downloadCSVMinorAllocation);
router.get("/allocate/minor/:id", authToken, getSingleMinorAllocation);
router.get("/student/:id", authToken, getStudentByIdForAdmin);


// UPDATE
router.patch("/allocate/confirm", authToken, confirmAllocation);
router.patch("/allocate/random", authToken, randomAlloteChoices);
router.patch("/student/:id", authToken, updateStudentDetails);

// TIMELINE
router.post("/timeline", authToken, setTimeline);
router.get("/timeline", authToken, getTimeline);
router.patch("/timeline", authToken, editTimeline);
router.delete("/timeline", authToken, resetTimeline);

export default router;
