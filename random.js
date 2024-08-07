// generate students csv data
const generateStudentsCSV = (size) => {
  const students = [];

  for (let i = 0; i < size; i++) {
    // students.push({
    //   name: "name" + i,
    //   regNo: "B23" + i,
    //   email: "test@email.com",
    //   sectionBatchNa
    // })
    const name = "name" + i;
    const regNo = "B23" + i;
    const email = "test@email.com";
    const programName = "coursename";
    const semester = 4;
    const sectionBatchName = "cs0x";
    const faName = "faname";
    const faEmail = "faname@email.com";
    const cgpa = (Math.random() * 10).toFixed(2);
    const sgpaS2 = (Math.random() * 10).toFixed(2);
    const sgpaS1 = (Math.random() * 10).toFixed(2);

    const student = `${name},${regNo},${email},${programName},${semester},${sectionBatchName},${faName},${faEmail},${cgpa},${sgpaS2},${sgpaS1}`;
    students.push(student);
    console.log(student + ",");
  }
};

generateStudentsCSV(150);
// console.log((Math.random() * 10).toFixed(2));
