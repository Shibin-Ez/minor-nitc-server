// import { courses, students } from "./data.js";
import { createStudentsFromCSV } from "./controllers/students.js";

// const coursesCSV = courses.map(course => `${course.id},${course.code},${course.title},${course.credit},${course.enrolled}`).join('\n');

// console.log(coursesCSV);

// const headers = Object.keys(students[0]).join(',');
// const rows = students.map(student => Object.values(student).join(','));

// const studentsCSV = `${headers}\n${rows.join('\n')}`;

// console.log(studentsCSV);

createStudentsFromCSV();
