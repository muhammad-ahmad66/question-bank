const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  clo: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  plo: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  marks: {
    type: Number,
  },
  difficulty: {
    type: String,
    enum: ["dl-1", "dl-2", "dl-3", "dl-4"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

// Pre-save middleware to automatically set the difficulty based on CLO
questionSchema.pre("save", function (next) {
  if (this.clo == 1) {
    this.difficulty = "dl-1";
  } else if (this.clo == 2 || this.clo == 3) {
    this.difficulty = "dl-2";
  } else if (this.clo == 4 || this.clo == 5) {
    this.difficulty = "dl-3";
  } else {
    this.difficulty = "dl-4";
  }

  next();
});

module.exports = mongoose.model("Question", questionSchema);
