const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ["ITso", "Developer"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);