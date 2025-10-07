const mongoose = require("mongoose");

const RemarkSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  remarkText: { type: String, required: true },
  shownAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  reviewerName: { type: String },
  reviewerEmail: { type: String },
  reviewerImage: { type: String },  
  reviewerRole: { type: String },   
  content: { type: String },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
})

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  selectedAnswer: { type: String, required: true }  
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },          
  givenBy: { type: String, required: true },        
  email: { type: String, required: true },       
  questions: [QuestionSchema],                     
  reviews: [ReviewSchema],
  score: { type: Number, default: 0 },              
  createdAt: { type: Date, default: Date.now }  
});

module.exports = mongoose.model("Quiz", QuizSchema);
