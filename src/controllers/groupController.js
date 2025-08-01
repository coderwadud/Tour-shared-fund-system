const User = require('../models/User');
const Group = require('../models/Group');
const CreateGroup = async (req, res) => {
    try {
    const { name, location, photo } = req.body;
    // Prevent duplicate group names
    const existing = await Group.findOne({ name });
    if (existing) return res.status(400).json({ error: "Group name already exists." });

    const group = new Group({
      name,
      location,
      photo,
      createdBy: req.userId,
    });

    await group.save();
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const GroupAdminAssign = async (req, res) => {
    const { userId, groupId } = req.body;
    try {
        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user || !group) {
        return res.status(404).json({ error: "User or Group not found" });
        }

        user.role = "admin";
        user.groupId = groupId;

        await user.save();

        res.status(200).json({ message: "User assigned as group admin", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const GroupList = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('createdBy', 'name email role') // shows who created the group
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const getGroupById = async (req, res) => {
//   const { groupId } = req.params;
//     try {
//       const users = await User.find({ groupId }) // Only those users whose groupId matches
//         .select("name email role phone address photo status"); // Optional: select only useful fields
//       res.status(200).json({
//         groupId,
//         totalUsers: users.length,
//         users
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// };
const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Get group details and populate creator's info
    const group = await Group.findById(groupId)
      .populate('createdBy')
      .lean(); // lean() gives plain JS object, faster + editable

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Get all users in this group
    const users = await User.find({ groupId })
      .select('-password') // exclude password
      .lean();

    res.status(200).json({
      totalUsers: users.length,
      groupDetails: group,
      users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const { name, location, photo } = req.body;

  try {
    const existing = await Group.findOne({ name, _id: { $ne: groupId } });
    if (existing) {
      return res.status(400).json({ error: "Group name already exists." });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, location, photo },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group updated successfully", group: updatedGroup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Optionally: remove groupId from users in this group
    await User.updateMany({ groupId }, { $set: { groupId: null, role: 'user' } });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateGroup,
  GroupAdminAssign,
  GroupList,
  getGroupById,
  updateGroup,
  deleteGroup
};
