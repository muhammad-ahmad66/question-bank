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
    enum: ["easy", "medium", "hard"],
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

// Pre-save middleware to automatically set the difficulty based on CLO and PLO
questionSchema.pre("save", function (next) {
  const avgValue = (this.clo + this.plo) / 2;

  if (avgValue >= 1 && avgValue <= 3) {
    this.difficulty = "easy";
  } else if (avgValue >= 4 && avgValue <= 6) {
    this.difficulty = "medium";
  } else if (avgValue >= 7 && avgValue <= 10) {
    this.difficulty = "hard";
  }

  next();
});

module.exports = mongoose.model("Question", questionSchema);
