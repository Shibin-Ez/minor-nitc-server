import Student from "../models/Student.js";
import Minor from "../models/Minor.js";
import { readFromCSV } from "../functions/readFromCSV.js";

// CREATE
export const createStudentsFromCSV = async () => {
  try {
    const students = await readFromCSV("./public/assets/students.csv");

    await Student.deleteMany({});
    await Student.insertMany(students);
    console.log("successfully uploaded students count: " + students.length);
    // res.status(201).json({ message: "Students created successfully" });
  } catch (err) {
    console.log(err);
    // res.status(409).json({ message: err.message });
  }
};

// READ
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getStudentResult = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log(studentId)
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // updatedStudent with course key
    const updatedStudent = {...student._doc, course: null};
    if (student.enrolled !== "none") {
      const course = await Minor.findById(student.enrolled);
      console.log(course);
      updatedStudent.course = course;
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getStudentChoices = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    const choices = [];
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const minors = await Minor.find();
    for (let i = 0; i < student.choices.length; i++) {
      const minor = minors.find((minor) => minor._id == student.choices[i]);
      choices.push(minor);
    }

    res.status(200).json(choices);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const updateStudentWithChoices = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { choices } = req.body; // expects array of minor ids
    console.log(choices);
    console.log(studentId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.choices = choices;
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const deleteStudentsChoices = async () => {
  try {
    await Student.updateMany({}, { choices: [] });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const setStudentVerification = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.isVerified = true;
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};