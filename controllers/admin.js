import Minor from "../models/Minor.js";
import Student from "../models/Student.js";
import { createStudentsFromCSV } from "./students.js";
import { createMinorsFromCSV } from "./minors.js";
import { Parser } from "json2csv";
import { getStageFun } from "./settings.js";
import Setting from "../models/Settings.js";
import Parameter from "../models/Parameter.js";

// UPLOAD
export const uploadCSV = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const stage = await getStageFun();
    if (stage.stage !== "notStarted") {
      return res.status(409).json({ message: "Timeline already set" });
    }

    console.log(req.file);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const response = await createStudentsFromCSV();

    if (!response)
      return res.status(409).json({ message: "Invalid CSV format" });

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const uploadCSVMinors = async (req, res) => {
  try {
    const username = req.user.username;
    
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const stage = await getStageFun();
    if (stage.stage !== "notStarted") {
      return res.status(409).json({ message: "Timeline already set" });
    }

    console.log(req.file);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const response = await createMinorsFromCSV();

    if (!response)
      return res.status(409).json({ message: "Invalid CSV format" });

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

// DOWNLOAD
export const downloadCSV = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.download("./public/assets/students.csv", "students.csv");
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const downloadCSVMinors = async (req, res) => {
  try {
    res.download("./public/assets/minors.csv", "minors.csv");
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const downloadCSVStudentsAllocation = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let vacancies = req.query.max ? req.query.max : 50;
    let minReqSeats = req.query.min ? req.query.min : 10;

    const parameters = await Parameter.find(); // return array of length 1 or 0
    if (parameters.length === 1) {
      vacancies = parameters[0].maxStudents;
      minReqSeats = parameters[0].minStudents;
    }

    const students = await allocateMinors(vacancies, minReqSeats);
    const minors = await Minor.find();
    const csvData = students.studentWise.data.map((studentData) => {
      const studentObj = {
        regNo: studentData.student.regNo,
        name: studentData.student.name,
        cgpa: studentData.student.cgpa,
        sgpaS2: studentData.student.sgpaS2,
        sgpaS1: studentData.student.sgpaS1,
        dateOfBirth: formatDate(studentData.student.dateOfBirth), // Format the date as dd-mm-yyyy
        enrolledCourse: studentData.enrolledCourse.name,
        choiceNo: studentData.choiceNo,
      };

      minors.forEach((minor, index) => {
        if (index < studentData.student.choices.length) {
          const minorId = studentData.student.choices[index];
          const minorData = minors.find((minor) => minor._id == minorId);
          studentObj[`choice${index + 1}`] = minorData
            ? minorData.name
            : "error";
        } else {
          studentObj[`choice${index + 1}`] = "none";
        }
      });

      return studentObj;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=students_allocation.csv"
    );
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);
    res.status(200).send(csv);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const downloadCSVMinorAllocation = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let vacancies = req.query.max ? req.query.max : 50;
    let minReqSeats = req.query.min ? req.query.min : 10;

    const parameters = await Parameter.find(); // return array of length 1 or 0
    if (parameters.length === 1) {
      vacancies = parameters[0].maxStudents;
      minReqSeats = parameters[0].minStudents;
    }

    const minorId = req.params.id;
    const students = await allocateMinors(vacancies, minReqSeats);
    let minorName = "";
    let csvData = [];

    for (const minor of students.courseWise.data) {
      if (minor.course._id == minorId) {
        minorName = minor.course.name;
        csvData = minor.students.map((studentData) => {
          return {
            regNo: studentData.student.regNo,
            name: studentData.student.name,
            cgpa: studentData.student.cgpa,
            sgpaS2: studentData.student.sgpaS2,
            sgpaS1: studentData.student.sgpaS1,
            dateOfBirth: formatDate(studentData.student.dateOfBirth), // Format the date as dd-mm-yyyy
            rank: studentData.rank,
            choiceNo: studentData.choiceNo,
          };
        });
      }
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=minor_allocation_${minorName}.csv`
    );
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);
    res.status(200).send(csv);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const downloadCSVMinorsAllocationDetails = async (req, res) => {
  const min = req.query.min ? req.query.min : 10;
  const max = req.query.max ? req.query.max : 50;
};

// RUN
export const allocateMinors = async (vacancies, minReqSeats) => {
  try {
    // const vacancies = 50;
    // const minReqSeats = 10;

    const courses = await Minor.find();
    const students = await Student.find();

    const droppedCourses = [];

    // ranking (sorting) students based on cgpa, sgpa 2, 1
    students.sort((a, b) => {
      if (a.cgpa === b.cgpa) {
        if (a.sgpaS2 === b.sgpaS2) {
          if (a.sgpaS1 === b.sgpaS1) {
            return a.dateOfBirth - b.dateOfBirth;
          }
          return b.sgpaS1 - a.sgpaS1;
        }
        return b.sgpaS2 - a.sgpaS2;
      }
      return b.cgpa - a.cgpa;
    });

    // allocating seats
    let allCoursesHaveMinReqSeats = false;
    while (!allCoursesHaveMinReqSeats) {
      // reset enrolled status
      for (const course of courses) {
        course.enrolled = 0;
      }

      // assigning courses to students based on their choices
      for (const student of students) {
        for (const choice of student.choices) {
          const course = courses.find((course) => course.id === choice);
          if (course && course.enrolled < vacancies) {
            course.enrolled++;
            student.enrolled = choice;
            break;
          }
        }
      }

      // checking if all courses have minimum required seats
      allCoursesHaveMinReqSeats = true;
      let min = Number.MAX_VALUE;
      let minIndex = -1;
      for (const [index, course] of courses.entries()) {
        if (course.enrolled < minReqSeats) {
          console.log(
            `Course ${course.code} has less than ${minReqSeats} students`
          );
          allCoursesHaveMinReqSeats = false;
          if (course.enrolled < min) {
            min = course.enrolled;
            minIndex = index;
          }
        }
      }

      // if no, delete the course(s) with lowest students
      if (!allCoursesHaveMinReqSeats) {
        for (const [index, course] of courses.entries()) {
          if (course.enrolled === min) {
            console.log(`Course ${course.code} deleted`);
            droppedCourses.push({
              course,
              students: [],
              enrolled: 0,
              isDropped: true,
            });
            courses.splice(index, 1);
          }
        }
      }
    }

    // print allocation details course wise
    console.log("Course Allocation");
    console.log("====================================");

    const courseWiseData = [];

    for (const course of courses) {
      console.log(
        `${course.code} (${course.name}) - Enrolled: ${course.enrolled}/${vacancies}`
      );
      const studentsData = [];
      for (const [index, student] of students.entries()) {
        if (student.enrolled === course.id) {
          const choiceNo = student.choices.indexOf(course.id) + 1;
          console.log(
            `\t${student.regNo} - ${student.name} - rank: ${
              index + 1
            } - choiceNo: ${choiceNo}`
          );
          studentsData.push({
            student,
            rank: index + 1,
            choiceNo,
          });
        }
      }

      courseWiseData.push({
        course,
        enrolled: course.enrolled,
        students: studentsData,
        isDropped: false,
      });

      console.log();
    }

    // print unallocated students
    console.log("Unallocated Students");
    console.log("====================================");

    const studentWiseData = [];
    const unallocatedStudents = [];
    for (const [index, student] of students.entries()) {
      let enrolledCourse = {};
      let atleastOne = false;
      for (const course of courses) {
        if (student.enrolled === course.id) {
          enrolledCourse = course;
          atleastOne = true;
          break;
        }
      }

      if (!atleastOne) {
        console.log(
          `${student.regNo} - ${student.name} - cgpa: ${student.cgpa} - sgpaS2: ${student.sgpaS2} - sgpaS1: ${student.sgpaS1}`
        );
        unallocatedStudents.push(student);
      }

      studentWiseData.push({
        student,
        rank: index + 1,
        enrolledCourse,
        choiceNo: student.choices.indexOf(enrolledCourse.id) + 1,
      });
    }

    for (const item of droppedCourses) {
      courseWiseData.push(item);
    }

    return {
      courseWise: {
        data: courseWiseData,
        droppedCourses,
        vacancies,
        minReqSeats,
      },
      studentWise: { data: studentWiseData, unallocatedStudents },
    };
  } catch (err) {
    console.log(err);
    return { message: err.message };
  }
};

export const getSingleMinorAllocation = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let vacancies = req.query.max ? req.query.max : 50;
    let minReqSeats = req.query.min ? req.query.min : 10;
    console.log(vacancies, minReqSeats);
    const parameters = await Parameter.find(); // return array of length 1 or 0
    if (parameters.length === 1) {
      vacancies = parameters[0].maxStudents;
      minReqSeats = parameters[0].minStudents;
    }
    console.log("hello: ", vacancies, minReqSeats);

    const minorId = req.params.id;
    const details = await allocateMinors(vacancies, minReqSeats);
    const minorDetails = details.courseWise.data.find(
      (minor) => minor.course._id == minorId
    );
    res.status(200).json(minorDetails.students);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMinorAllocation = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let vacancies = req.query.max ? req.query.max : 50;
    let minReqSeats = req.query.min ? req.query.min : 10;

    const parameters = await Parameter.find(); // return array of length 1 or 0
    if (parameters.length === 1) {
      vacancies = parameters[0].maxStudents;
      minReqSeats = parameters[0].minStudents;
    }

    const details = await allocateMinors(vacancies, minReqSeats);
    res.status(200).json(details);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMinorAllocationStudents = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : totalStudents;

    let vacancies = req.query.max ? req.query.max : 50;
    let minReqSeats = req.query.min ? req.query.min : 10;

    const parameters = await Parameter.find(); // return array of length 1 or 0
    if (parameters.length === 1) {
      vacancies = parameters[0].maxStudents;
      minReqSeats = parameters[0].minStudents;
    }

    const details = await allocateMinors(vacancies, minReqSeats);

    res.status(200).json({
      students: details.studentWise.data.slice(
        (page - 1) * limit,
        page * limit
      ),
      currentPage: page,
      totalPages: Math.ceil(details.studentWise.data.length / limit),
      totalStudents: details.studentWise.data.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const confirmAllocation = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const stage = await getStageFun();
    if (stage.stage === "resultPublished") {
      return res.status(409).json({ message: "result already published" });
    }

    if (stage.stage !== "choiceFillingEnd") {
      return res.status(409).json({ message: "choice filling not finished" });
    }

    const vacancies = req.query.max ? req.query.max : 50;
    const minReqSeats = req.query.min ? req.query.min : 10;
    const students = await allocateMinors(vacancies, minReqSeats);
    const studentsData = students.studentWise.data;
    console.log(studentsData);
    const bulkUpdates = [];
    for (const studentData of studentsData) {
      bulkUpdates.push({
        updateOne: {
          filter: { _id: studentData.student._id },
          update: { enrolled: studentData.enrolledCourse._id },
        },
      });
    }

    await Student.bulkWrite(bulkUpdates);
    console.log("students enrolled and assigned to minors successfully");

    const date = new Date().toISOString();
    const response = await Setting.findByIdAndUpdate(
      "timeline",
      { resultDate: date },
      { new: true }
    );
    console.log(response);

    // Set Parameters
    const parameters = new Parameter({
      _id: "parameters",
      minStudents: minReqSeats,
      maxStudents: vacancies,
    });

    const savedParameters = await parameters.save();

    res.status(200).json({
      message: "students enrolled and assigned to minors successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// TEMP
export const randomAlloteChoices = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const students = await Student.find();
    const minors = await Minor.find();

    const choicesLen = minors.length;
    const bulkUpdates = [];

    for (const [index, student] of students.entries()) {
      const choices = [];
      for (const minor of minors) {
        choices.push(minor._id);
      }

      const newChoices = [];
      for (let i = 0; i < choicesLen; i++) {
        const randomIndex = Math.floor(Math.random() * choices.length);
        newChoices.push(choices[randomIndex]);
        choices.splice(randomIndex, 1);
      }

      bulkUpdates.push({
        updateOne: {
          filter: { _id: student._id },
          update: { choices: newChoices },
        },
      });
    }

    await Student.bulkWrite(bulkUpdates);
    console.log("Choices allocated successfully");
    res.status(200).json({ message: "Choices allocated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getStudentByIdForAdmin = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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

export const updateStudentDetails = async (req, res) => {
  try {
    const username = req.user.username;

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const studentId = req.params.id;
    console.log(studentId);
    console.log(req.body);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const correctedDetailsObj = req.body; // object containg data of corrected details only
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      correctedDetailsObj,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
