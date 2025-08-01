const User = require('../models/User');
const bcrypt = require('bcryptjs');
// Approve or reject user status
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all users (for admin panel)
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('groupId');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    // If password is included, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password').populate('groupId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  updateUserStatus,
  listUsers,
  updateUserProfile,
  getSingleUser,
  deleteUser
};
