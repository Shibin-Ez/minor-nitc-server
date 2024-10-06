import fs from "fs";
import csv from "csv-parser";
import { parse, isValid } from "date-fns";

const dateFormats = ["yyyy-MM-dd", "MM/dd/yyyy", "dd-MM-yyyy"]; // Add more formats as needed

export const readFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const students = [];
    let errorOccurred = false;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", () => {
        try {
          const updatedStudents = students.map((student, index) => {
            // Basic validation for mandatory fields
            if (
              !student.dateOfBirth ||
              !student.cgpa ||
              !student.sgpaS2 ||
              !student.sgpaS1 ||
              !student.semester
            ) {
              errorOccurred = true;
              throw new Error(
                `Invalid CSV format: Missing fields in row ${index + 1}`
              );
            }

            // Parse and validate date of birth
            let parsedDateOfBirth;
            try {
              parsedDateOfBirth = parse(
                student.dateOfBirth,
                dateFormats[2],
                new Date()
              );
              if (isNaN(parsedDateOfBirth)) {
                errorOccurred = true;
                throw new Error(
                  `Invalid date format for dateOfBirth in row ${index + 1}`
                );
              }
            } catch (error) {
              throw new Error(
                `Failed to parse dateOfBirth in row ${index + 1}: ${
                  error.message
                }`
              );
            }

            // Return processed student
            return {
              ...student,
              cgpa: parseFloat(student.cgpa),
              sgpaS2: parseFloat(student.sgpaS2),
              sgpaS1: parseFloat(student.sgpaS1),
              semester: parseInt(student.semester),
              dateOfBirth: parsedDateOfBirth,
            };
          });

          if (errorOccurred) {
            reject(
              new Error(
                "CSV file format is incorrect. Please upload a valid file."
              )
            );
          } else {
            console.log("CSV file successfully processed");
            resolve(updatedStudents);
          }
        } catch (error) {
          reject(error); // Reject the promise if any error is caught
        }
      })
      .on("error", (error) => {
        reject(new Error("Error reading CSV file: " + error.message));
      });
  });
};

export const readFromCSVMinors = (filePath) => {
  return new Promise((resolve, reject) => {
    const minors = [];
    let errorOccurred = false;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        minors.push(row);
      })
      .on("end", () => {
        const updatedMinors = minors.map((minor, index) => {
          if (!minor.name || !minor.faculty || !minor.facultyEmail) {
            errorOccurred = true;
            throw new Error(
              `Invalid CSV format: Missing fields in row ${index + 1}`
            );
          }

          return {
            ...minor,
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
