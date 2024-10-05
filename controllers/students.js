import Student from "../models/Student.js";
import Minor from "../models/Minor.js";
import { readFromCSV } from "../functions/readFromCSV.js";
import { getStageFun } from "./settings.js";

// CREATE
export const createStudentsFromCSV = async () => {
  try {
    const students = await readFromCSV("./public/assets/students.csv");

    await Student.deleteMany({});
    await Student.insertMany(students);
    console.log("successfully uploaded students count: " + students.length);
    return true;
  } catch (err) {
    console.log(err);
    // res.status(409).json({ message: err.message });
  }
};

// READ
export const getStudents = async (req, res) => {
  try {
    const username = req.user.username;
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const totalStudents = await Student.countDocuments();

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : totalStudents;

    const students = await Student.find()
      .skip((page - 1) * limit)
      .limit(limit);

    if (limit === -1) {
      res.status(200).json({
        students,
        currentPage: page,
        totalPages: math.ceil(totalStudents / limit),
      });
      return;
    }
    const limitedStudents = students.slice((page - 1) * limit, page * limit);
    res.status(200).json(limitedStudents);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const studentId = req.user.id;
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
    const studentId = req.user.id;
    console.log(studentId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // updatedStudent with course key
    const updatedStudent = { ...student._doc, course: null };
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
    const studentId = req.user.id;
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
    const studentId = req.user.id;
    const { choices } = req.body; // expects array of minor ids
    console.log(choices);
    console.log(studentId);

    const stage = await getStageFun();

    if (stage.stage !== "choiceFilling") {
      return res.status(403).json({ message: "Choice filling is not open" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.choices.length !== 0) {
      return res.status(403).json({ message: "Choices already filled" });
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
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    const stage = await getStageFun();
    if (stage.stage !== "verification") {
      return res.status(403).json({ message: "Verification is not open" });
    }

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
