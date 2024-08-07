import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingsSchema);

export default Setting;