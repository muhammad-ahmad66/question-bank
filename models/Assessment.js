// models/Assessment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
  assessmentName: {
    type: String,
    required: [true, "Please provide an assessment name"],
  },
  type: {
    type: String,
    enum: ["quiz", "assignment", "mid-term", "final-term"],
    required: [true, "Please specify the type of assessment"],
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course ID"],
  },
  startDate: {
    type: Date,
    // required: [true, "Please provide a start date"],
  },
  endDate: {
    type: Date,
    // required: [true, "Please provide an end date"],
  },
  description: {
    type: String,
    // required: [true, "Please provide a description"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
