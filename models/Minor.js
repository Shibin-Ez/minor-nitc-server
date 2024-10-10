import mongoose from "mongoose";

const minorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
		faculty: {
			type: String,
			required: true,
		},
		facultyEmail: {
			type: String,
			required: true,
		},
    fileURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Minor = mongoose.model("Minor", minorSchema);

export default Minor;
