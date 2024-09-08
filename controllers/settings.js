import Setting from "../models/Settings.js";
import { deleteStudentsChoices } from "./students.js";

// CREATE
export const setTimeline = async (req, res) => {
  try {
    const {
      startDate,
      verificationEndDate,
      choicefillingStartDate,
      choicefillingEndDate,
    } = req.body;

    const timelines = await Setting.find();
    if (timelines.length > 0)
      return res.status(403).json({ message: "timeline already exists" });

    const currentDate = new Date().toISOString();
    if (startDate < currentDate)
      return res
        .status(403)
        .json({ message: "Starting date has already passed" });

    if (
      !(
        startDate < verificationEndDate &&
        verificationEndDate < choicefillingStartDate &&
        choicefillingStartDate < choicefillingEndDate
      )
    ) {
      return res.status(403).json({ message: "date order confilict" });
    }

    const newSetting = new Setting({
      startDate,
      verificationEndDate,
      choicefillingStartDate,
      choicefillingEndDate,
    });

    const savedSetting = await newSetting.save();
    res.status(201).json(savedSetting);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// READ
export const getTimeline = async (req, res) => {
  try {
    const timelines = await Setting.find();
    res.status(200).json(timelines[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getStage = async (req, res) => {
  try {
    const timelines = await Setting.find();
    if (timelines.length === 0)
      return res
        .status(404)
        .json({ stage: "notStarted", message: "timeline not found" });

    const timeline = timelines[0];
    const currentDate = new Date().toISOString();
    // currentDate = currentDate.slice(0, -5) + '000Z';
    console.log(currentDate);
    console.log(timeline.verificationEndDate);

    const currentDateObj = new Date(currentDate);
    const startDateObj = new Date(timeline.startDate);
    const verificationEndDateObj = new Date(timeline.verificationEndDate);
    const choicefillingStartDateObj = new Date(timeline.choicefillingStartDate);
    const choicefillingEndDateObj = new Date(timeline.choicefillingEndDate);

    if (currentDateObj < startDateObj)
      return res.status(200).json({ stage: "notStarted" });

    if (currentDateObj < verificationEndDateObj)
      return res.status(200).json({ stage: "verification" });

    if (currentDateObj < choicefillingStartDateObj)
      return res.status(200).json({ stage: "verificationEnd" });

    if (currentDateObj < choicefillingEndDateObj)
      return res.status(200).json({ stage: "choiceFilling" });

    return res.status(200).json({ stage: "choiceFillingEnd" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const editTimeline = async (req, res) => {
  try {
    const {
      startDate,
      verificationEndDate,
      choicefillingStartDate,
      choicefillingEndDate,
    } = req.body;

    const prevTimelines = await Setting.find();
    if (prevTimelines.length === 0)
      return res.status(404).json({ message: "timeline not found" });
    const prevTimeline = prevTimelines[0];

    const currentDate = new Date().toISOString();
    if (startDate < currentDate)
      return res
        .status(403)
        .json({ message: "starting date has already passed" });

    if (
      !(
        startDate < verificationEndDate &&
        verificationEndDate < choicefillingStartDate &&
        choicefillingStartDate < choicefillingEndDate
      )
    ) {
      return res.status(403).json({ message: "date order confilict" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const resetTimeline = async (req, res) => {
  try {
    // delete timeline
    await Setting.deleteMany({});

    // delete students' choice details
    await deleteStudentsChoices();
    res.status(200).json({ message: "reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
