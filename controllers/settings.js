import Setting from "../models/Settings.js";
import { deleteStudentsChoices } from "./students.js";

// CREATE
export const setTimeline = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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
      _id: "timeline",
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
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const timelines = await Setting.find();
    res.status(200).json(timelines[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getStageFun = async () => {
  try {
    const timelines = await Setting.find();
    if (timelines.length === 0) {
      return { stage: "notStarted", message: "timeline not found" };
    }

    const timeline = timelines[0];
    console.log(timeline);
    const currentDate = new Date();
    console.log(currentDate.toISOString());
    console.log(timeline.verificationEndDate);

    const startDateObj = new Date(timeline.startDate);
    const verificationEndDateObj = new Date(timeline.verificationEndDate);
    const choicefillingStartDateObj = new Date(timeline.choicefillingStartDate);
    const choicefillingEndDateObj = new Date(timeline.choicefillingEndDate);
    const resultDateObj = timeline.resultDate && new Date(timeline.resultDate);

    if (resultDateObj && currentDate >= resultDateObj) {
      return { stage: "resultPublished" };
    }

    if (currentDate < startDateObj) {
      return { stage: "notStarted" };
    }

    if (currentDate < verificationEndDateObj) {
      return { stage: "verification" };
    }

    if (currentDate < choicefillingStartDateObj) {
      return { stage: "verificationEnd" };
    }

    if (currentDate < choicefillingEndDateObj) {
      return { stage: "choiceFilling" };
    }

    return { stage: "choiceFillingEnd" };
  } catch (err) {
    console.log(err);
    throw new Error(err.message); // Propagate the error
  }
};


export const getStage = async (req, res) => {
  try {
    const stage = await getStageFun();
    res.status(200).json(stage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const editTimeline = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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
