const mongoose = require("mongoose");

const devSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  team: { type: String},
  pod: { type: String},
  badges: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  testsTaken: [{ type: String }],
  itsoName: { type: String,}, // ITSO responsible
  designation: { type: String},
  email: { type: String, required: true, unique: true, lowercase: true },
  psid: { type: String},
  rank:{type:Number}
}, { timestamps: true });

module.exports = mongoose.model("Dev", devSchema);