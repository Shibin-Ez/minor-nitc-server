import Minor from "../models/Minor.js";
import { readFromCSVMinors } from "../functions/readFromCSV.js";

// CREATE
export const createMinor = async (req, res) => {
  try {
    const {
      name,
      code,
      department,
      faculty,
      facultyEmail,
      facultyContact,
      credit,
      description,
      schedule,
    } = req.body;

    const newMinor = new Minor({
      name,
      code,
      department,
      faculty,
      facultyEmail,
      facultyContact,
      credit,
      description,
      schedule,
    });

    const savedMinor = await newMinor.save();
    res.status(201).json(savedMinor);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const createMinorsFromCSV = async (req, res) => {
  try {
    const minors = await readFromCSVMinors("./public/assets/minors.csv");
    console.log(minors);
    await Minor.deleteMany({});
    await Minor.insertMany(minors);
    console.log("successfully uploaded minors count: " + minors.length);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}

// READ
export const getMinors = async (req, res) => {
  try {
    const minors = await Minor.find();
    res.status(200).json(minors);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getMinorById = async (req, res) => {
  try {
    const minorId = req.params.id;
    const minor = await Minor.findById(minorId);
    if (!minor) {
      return res.status(404).json({ message: "Minor not found" });
    }
    res.status(200).json(minor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
