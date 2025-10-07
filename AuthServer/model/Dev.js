const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  quizTitle: { type: String },
  score: { type: Number },
  questions: [
    {
      questionText: { type: String },
      selectedAnswer: { type: String },
    },
  ],
  takenAt: { type: Date, default: Date.now },
});

const devSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  team: { type: String},
  pod: { type: String},
  badges: [{ type: String }],
  highScore: { type: Number, default: 0 },
  testsTaken: [testSchema],
  designation: { type: String},
  email: { type: String, required: true, unique: true, lowercase: true },
  psid: { type: String},
  rank:{type:Number}
}, { timestamps: true });

module.exports = mongoose.model("Dev", devSchema);