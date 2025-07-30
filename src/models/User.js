const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  address: String,
  photo: String, // URL
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'user'],
    default: 'user'
  },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

