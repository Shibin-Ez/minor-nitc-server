import fs from "fs";
import csv from "csv-parser";

const readFromCSV = (filePath) => {
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

export default readFromCSV;