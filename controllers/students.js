import Student from "../models/Student.js";
import readFromCSV from "../functions/readFromCSV.js";

// CREATE
export const createStudentsFromCSV = async () => {
  try {
    const students = await readFromCSV("./data/students.csv");
    console.log(students);

    await Student.insertMany(students);
    console.log("Students data uploaded successfully");
    res.status(201).json({ message: "Students created successfully" });
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

// UPDATE
export const updateStudentWithChoices = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { choices } = req.body; // expects array of minor ids
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
