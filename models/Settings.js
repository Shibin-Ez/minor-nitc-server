import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Make _id a String type
    },
    startDate: {
      type: Date,
      required: true,
    },
    verificationEndDate: {
      type: Date,
      required: true,
    },
    choicefillingStartDate: {
      type: Date,
      required: true,
    },
    choicefillingEndDate: {
      type: Date,
      required: true,
    },
    resultDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingsSchema);

export default Setting;