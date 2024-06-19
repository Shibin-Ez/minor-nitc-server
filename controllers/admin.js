import Minor from "../models/Minor.js";
import Student from "../models/Student.js";
import { courses, students } from "../data.js";

// RUN
export const allocateMinors = async (req, res) => {
  try {
    const vacancies = 8;
    const minReqSeats = 5;

		// const courses = await Minor.find();
		// const students = await Student.find();

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

      // if no, delete the course with lowest students
      if (!allCoursesHaveMinReqSeats) {
        courses.splice(minIndex, 1);

        // reset enrolled status
        for (const course of courses) {
          course.enrolled = 0;
        }
      }
    }

    // print allocation details course wise
    console.log("Course Allocation");
    console.log("====================================");
    for (const course of courses) {
      console.log(
        `${course.code} (${course.title}) - Enrolled: ${course.enrolled}/${vacancies}`
      );
      for (const [index, student] of students.entries()) {
        if (student.enrolled === course.id) {
          const choiceNo = student.choices.indexOf(course.id) + 1;
          console.log(
            `\t${student.regNo} - ${student.name} - rank: ${
              index + 1
            } - choiceNo: ${choiceNo}`
          );
        }
      }

      console.log();
    }

    // print unallocated students
    console.log("Unallocated Students");
    console.log("====================================");
    for (const student of students) {
      if (!student.enrolled) {
        console.log(
          `${student.regNo} - ${student.name} - cgpa: ${student.cgpa} - sgpaS2: ${student.sgpaS2} - sgpaS1: ${student.sgpaS1}`
        );
      }
    }

		res.status(200).json({ message: "Minors allocated successfully" });
  } catch (err) {
    console.log(err);
		res.status(409).json({ message: err.message });
  }
};
