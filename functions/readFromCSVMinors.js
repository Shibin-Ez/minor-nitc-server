

const readFromCSV = (filePath) => {
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