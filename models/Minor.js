import mongoose from "mongoose";

const minorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
		department: {
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
		facultyContact: {
			type: String,
			required: true,
		},
    credit: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
		schedule: {
			type: String,
			required: true,
		},
  },
  {
    timestamps: true,
  }
);

const Minor = mongoose.model("Minor", minorSchema);

export default Minor;
