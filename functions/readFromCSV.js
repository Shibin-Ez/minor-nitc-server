import fs from "fs";
import csv from "csv-parser";
import { parse, isValid } from "date-fns";

const dateFormats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd-MM-yyyy']; // Add more formats as needed

export const readFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const students = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", () => {
        const updatedStudents = students.map((student, index) => {
          return {
            ...student,
            cgpa: parseFloat(student.cgpa),
            sgpaS2: parseFloat(student.sgpaS2),
            sgpaS1: parseFloat(student.sgpaS1),
            semester: parseInt(student.semester),
            // input format dd-mm-yyyy
            dateOfBirth: parse(student.dateOfBirth, dateFormats[2], new Date()),
          };
        });
        console.log("CSV file successfully processed");
        resolve(updatedStudents);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export const readFromCSVMinors = (filePath) => {
  return new Promise((resolve, reject) => {
    const minors = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        minors.push(row);
      })
      .on("end", () => {
        const updatedMinors = minors.map((minor, index) => {
          return {
            ...minor,
            credit: parseInt(minor.credit),
          };
        });
        console.log("CSV file successfully processed");
        resolve(updatedMinors);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
