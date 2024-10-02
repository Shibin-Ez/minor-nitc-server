const middleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Expose the Content-Range header to the client
  res.header("Access-Control-Expose-Headers", "Content-Range, X-Total-Count");

  // Assuming you're dealing with a collection of resources
  // Set the Content-Range header (this is just an example)
  res.header("Content-Range", "exhibitors 0-24/100");
  res.header("X-Total-Count", "100"); // Optional: Custom header for total count

  next();
};

export default middleware;