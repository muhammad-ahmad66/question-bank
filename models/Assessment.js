// models/Assessment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
  assessmentName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
