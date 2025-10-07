const mongoose = require("mongoose");

const RemarkSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  remarkText: { type: String, required: true },        
  shownAt: { type: Date, default: Date.now }            
});

const ReviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },   // who gave the review
  reviewerEmail: { type: String, required: true },  // reviewer’s email
  content: { type: String, required: true },        // review text
  remarks: [RemarkSchema],                          // remarks linked to questions
  createdAt: { type: Date, default: Date.now }      // when review given
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },   // only question text
  selectedAnswer: { type: String, required: true }  // selected answer by user
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },          // quiz title
  givenBy: { type: String, required: true },        // who gave the quiz
  email: { type: String, required: true },          // email of quiz giver
  questions: [QuestionSchema],                      // quiz questions
  reviews: [ReviewSchema],                          // all reviews in quiz level
  score: { type: Number, default: 0 },              // final score
  createdAt: { type: Date, default: Date.now }    // quiz creation time
});

module.exports = mongoose.model("Quiz", QuizSchema);
