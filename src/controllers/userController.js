const User = require('../models/User');

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

module.exports = {
  updateUserStatus,
  listUsers
};
