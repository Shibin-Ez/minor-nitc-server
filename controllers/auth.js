// firebase login
export const continueWithGoogle = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;
    console.log(name, email, photoURL);

    if (!email.endsWith("@nitc.ac.in")) {
      return res
        .status(403)
        .json({ success: false, message: "Only NITC emails are allowed" });
    }

    // eg: fayis_b220852cs@nitc.ac.in
    let semester = 5;
    const yearCode = email.split("_")[1].substring(1, 3);
    if (yearCode === "23") semester = 3;
    if (yearCode === "24") semester = 1;

    // only allow semester 3 students
    if (semester !== 3) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only 3rd semester students are allowed",
        });
    }

    res
      .status(200)
      .json({ success: true, semester, message: "Login successful" });
  } catch (err) {
    res.status(409).json({ message: err.message });
    console.log(err);
  }
};
