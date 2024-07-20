// models/Course.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
