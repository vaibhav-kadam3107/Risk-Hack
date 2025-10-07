const mongoose = require("mongoose");

const itsoSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  team: { type: String},
  psid: { type: String, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  assignedEvaluation: [{ type: String }],
  experience: { type: Number},
}, { timestamps: true });

module.exports = mongoose.model("ITSO", itsoSchema);
