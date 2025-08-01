const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
  photo: { type: String },
  costIdea: { type: Number, required: true },
  fixedCost: { type: Number, default: 0 },
  programDate: { type: Date, required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Program", programSchema);
