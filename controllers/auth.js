import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

// firebase login
export const continueWithGoogle = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    console.log(name, email, photo);

    // if (!email.endsWith("@nitc.ac.in")) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Only NITC emails are allowed" });
    // }

    // eg: fayis_b220852cs@nitc.ac.in
    let semester = 5;
    // const yearCode = email.split("_")[1].substring(1, 3);
    // if (yearCode === "23") semester = 3;
    // if (yearCode === "24") semester = 1;

    // only allow semester 3 students
    // if (semester !== 3) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only 3rd semester students are allowed",
    //   });
    // }

    // check if student exists in db
    const student = await Student.findOne({ email });

    if (!student) return res.status(404).json({ message: "Student not found" });

    // create token
    const studentObj = { id: student._id };
    const accessToken = jwt.sign(studentObj, process.env.JWT_SECRET);
    console.log(accessToken);

    res.status(200).json({
      success: true,
      token: accessToken,
      studentId: student._id,
      semester,
      message: "Login successful",
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
    console.log(err);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminObj = { username: "admin" };
      const accessToken = jwt.sign(adminObj, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        token: accessToken,
        message: "Login successful",
      });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
    console.log(err);
  }
};
