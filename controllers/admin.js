import Minor from "../models/Minor.js";
import Student from "../models/Student.js";
import { courses, students } from "../data.js";
import { createStudentsFromCSV } from "./students.js";

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
export const allocateMinors = async (req, res) => {
  try {
    const vacancies = 4;
    const minReqSeats = 4;

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

    res.status(200).json({
      courseWise: {
        data: courseWiseData,
        droppedCourses,
        vacancies,
        minReqSeats,
      },
      studentWise: { data: studentWiseData, unallocatedStudents },
    });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};
