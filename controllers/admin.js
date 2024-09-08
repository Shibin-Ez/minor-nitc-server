import Minor from "../models/Minor.js";
import Student from "../models/Student.js";
import { courses, students } from "../data.js";
import { createStudentsFromCSV } from "./students.js";
import { createMinorsFromCSV } from "./minors.js";

// UPLOAD
export const uploadCSV = async (req, res) => {
  try {
    console.log(req.file);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await createStudentsFromCSV();

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const uploadCSVMinors = async (req, res) => {
  try {
    console.log(req.file);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await createMinorsFromCSV();

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

// DOWNLOAD
export const downloadCSV = async (req, res) => {
  try {
    res.download("./public/assets/students.csv", "students.csv");
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
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
            droppedCourses.push(course);
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
      });

      console.log();
    }

    // print unallocated students
    console.log("Unallocated Students");
    console.log("====================================");

    const studentWiseData = [];
    const unallocatedStudents = [];
    for (const [index, student] of students.entries()) {
      let enrolledCouse = {};
      let atleastOne = false;
      for (const course of courses) {
        if (student.enrolled === course.id) {
          enrolledCouse = course;
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
        enrolledCouse,
      });
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

export const getMinorAllocation = async (req, res) => {
  try {
    const vacancies = req.query.max ? req.query.max : 50;
    const minReqSeats = req.query.min ? req.query.min : 10;
    const details = await allocateMinors(vacancies, minReqSeats);
    res.status(200).json(details);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const confirmAllocation = async (req, res) => {
  try {
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
          update: { enrolled: studentData.enrolledCouse._id },
        },
      });
    }

    await Student.bulkWrite(bulkUpdates);
    console.log("students enrolled and assigned to minors successfully");
    res.status(200).json({
      message: "students enrolled and assigned to minors successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// TEMP
export const randomAlloteChoices = async () => {
  try {
    const students = await Student.find();
    const minors = await Minor.find();

    const choicesLen = minors.length;
    const bulkUpdates = [];

    for (const student of students) {
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
  } catch (err) {
    console.log(err);
  }
};

// randomAlloteChoices();
