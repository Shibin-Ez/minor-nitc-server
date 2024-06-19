import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
		email: {
			type: String,
			required: true,
		},
		programName: {
			type: String,
			required: true,
		},
		semester: {
			type: Number,
			required: true,
		},
		sectionBatchName: {
			type: String,
			required: true,
		},
		faName: {
			type: String,
			required: true,
		},
		faEmail: {
			type: String,
			required: true,
		},
    cgpa: {
      type: Number,
      required: true,
    },
    sgpaS2: {
      type: Number,
      required: true,
    },
    sgpaS1: {
      type: Number,
      required: true,
    },
    choices: {
      type: [String],
			default: [],
    },
    enrolled: {
      type: String,
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
